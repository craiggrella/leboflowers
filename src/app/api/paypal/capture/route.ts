import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderReceipt } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { orderID, customerName, customerEmail, customerPhone, organization, items } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing PayPal order ID" }, { status: 400 });
    }

    const capture = await capturePayPalOrder(orderID);

    if (capture.status !== "COMPLETED") {
      console.error("PayPal capture failed:", capture);
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Write order to Supabase
    const supabase = createAdminClient();

    // Get verified prices from DB
    const productIds = items.map((i: { productId: string }) => i.productId);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, sku, name, price_cents")
      .in("id", productIds);

    let totalCents = 0;
    const orderItems = items.map((item: { productId: string; sku: string; quantity: number }) => {
      const product = dbProducts?.find((p) => p.id === item.productId);
      const priceCents = product?.price_cents || 0;
      totalCents += priceCents * item.quantity;
      return {
        product_id: item.productId,
        sku: product?.sku || item.sku,
        product_name: product?.name || item.sku,
        price_cents: priceCents,
        quantity: item.quantity,
      };
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName || "Unknown",
        customer_email: customerEmail || "",
        customer_phone: customerPhone || "",
        status: "paid",
        subtotal_cents: totalCents,
        payment_method: "online_card",
        source: "online",
        stripe_payment_intent: `paypal_${orderID}`,
        organization: organization || null,
        notes: `PayPal Order ID: ${orderID}`,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems.map((item: { product_id: string; sku: string; product_name: string; price_cents: number; quantity: number }) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // Send receipt email (non-blocking)
    if (customerEmail) {
      sendOrderReceipt({
        orderNumber: order.order_number,
        customerName: customerName || "Customer",
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
      }).catch((err) => console.error("Receipt email failed:", err));
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Capture failed" },
      { status: 500 }
    );
  }
}
