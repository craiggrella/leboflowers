import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { customerName, paymentMethod, checkNumber, items } = await req.json();

    if (!customerName || !items?.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Calculate total
    let totalCents = 0;
    const orderItems = items.map((item: { productId: string; sku: string; name: string; priceCents: number; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      const price = product?.price_cents || item.priceCents;
      totalCents += price * item.quantity;
      return {
        sku: item.sku,
        product_name: product?.name || item.name,
        price_cents: price,
        quantity: item.quantity,
        product_id: product?.id || null,
      };
    });

    const supabase = createAdminClient();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: "",
        status: "paid",
        subtotal_cents: totalCents,
        payment_method: paymentMethod,
        source: "in_person",
        check_number: paymentMethod === "check" ? checkNumber : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Manual order error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems.map((item: { sku: string; product_name: string; price_cents: number; quantity: number; product_id: string | null }) => ({ ...item, order_id: order.id })));

    if (itemsError) {
      console.error("Manual order items error:", itemsError);
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Manual POS error:", error);
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }
}
