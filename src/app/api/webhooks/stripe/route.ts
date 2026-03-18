import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendOrderReceipt } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabase = createAdminClient();

    const customerName = session.metadata?.customerName || "Unknown";
    const customerEmail = session.customer_email || "";
    const customerPhone = session.metadata?.customerPhone || "";
    const subtotalCents = session.amount_total || 0;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        status: "paid",
        subtotal_cents: subtotalCents,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        payment_method: "online_card",
        source: "online",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation failed:", orderError);
      return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
    }

    // Look up products from DB by SKU
    const itemsMeta = JSON.parse(session.metadata?.items || "[]") as { sku: string; qty: number }[];
    const skus = itemsMeta.map((i) => i.sku);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, sku, name, price_cents")
      .in("sku", skus);

    const orderItems = itemsMeta.map((item) => {
      const product = dbProducts?.find((p) => p.sku === item.sku);
      return {
        order_id: order.id,
        product_id: product?.id || null,
        sku: item.sku,
        product_name: product?.name || item.sku,
        price_cents: product?.price_cents || 0,
        quantity: item.qty,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Order items creation failed:", itemsError);
    }

    // Send receipt email (non-blocking)
    if (customerEmail) {
      sendOrderReceipt({
        orderNumber: order.order_number,
        customerName,
        customerEmail,
        items: orderItems.map((i) => ({
          sku: i.sku,
          name: i.product_name,
          priceCents: i.price_cents,
          quantity: i.quantity,
        })),
        totalCents: subtotalCents,
        paymentMethod: "online_card",
        createdAt: new Date().toISOString(),
      }).catch((err) => console.error("Receipt email failed:", err));
    }
  }

  return NextResponse.json({ received: true });
}
