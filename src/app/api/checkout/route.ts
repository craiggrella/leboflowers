import { NextRequest, NextResponse } from "next/server";
import { getSquareClient } from "@/lib/square";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderReceipt } from "@/lib/email";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const {
      sourceId,
      items,
      customerName,
      customerEmail,
      customerPhone,
      organization,
    } = await req.json();

    if (!sourceId || !items?.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Validate prices against DB
    const productIds = items.map((i: { productId: string }) => i.productId);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, sku, name, price_cents, unit_label")
      .in("id", productIds);

    if (!dbProducts) {
      return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
    }

    let totalCents = 0;
    const orderItems = items.map(
      (item: { productId: string; sku: string; quantity: number }) => {
        const product = dbProducts.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        totalCents += product.price_cents * item.quantity;
        return {
          sku: product.sku,
          product_name: product.name,
          price_cents: product.price_cents,
          quantity: item.quantity,
          product_id: product.id,
        };
      }
    );

    // Create Square payment
    const square = getSquareClient();
    const payment = await square.payments.create({
      sourceId,
      idempotencyKey: randomUUID(),
      amountMoney: {
        amount: BigInt(totalCents),
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
      note: `Mt Lebanon Flower Sale - ${customerName}`,
      buyerEmailAddress: customerEmail,
    });

    if (!payment.payment || payment.payment.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment failed" }, { status: 400 });
    }

    const result = payment;

    // Write order to Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || "",
        status: "paid",
        subtotal_cents: totalCents,
        payment_method: "online_card",
        source: "online",
        organization: organization || null,
        stripe_payment_intent: `square_${result.payment?.id}`,
        notes: `Square Payment ID: ${result.payment?.id}`,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    // Write order items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems.map((item: { sku: string; product_name: string; price_cents: number; quantity: number; product_id: string }) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // Send receipt email (must await — Vercel kills function after response)
    if (customerEmail) {
      try {
        await sendOrderReceipt({
          orderNumber: order.order_number,
          customerName,
          customerEmail,
          items: orderItems.map((i: { sku: string; product_name: string; price_cents: number; quantity: number }) => ({
            sku: i.sku,
            name: i.product_name,
            priceCents: i.price_cents,
            quantity: i.quantity,
          })),
          totalCents,
          organization: organization || undefined,
          paymentMethod: "online_card",
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Receipt email failed:", err);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
