import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canWrite } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canWrite(admin.role)) return NextResponse.json({ error: "Read-only access" }, { status: 403 });

    const { customerName, customerEmail, customerPhone, paymentMethod, checkNumber, organization, items } = await req.json();

    if (!customerName || !items?.length || !paymentMethod) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Look up products from DB by SKU to get correct IDs and prices
    const skus = items.map((i: { sku: string }) => i.sku);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, sku, name, price_cents")
      .in("sku", skus);

    // Calculate total from DB prices
    let totalCents = 0;
    const orderItems = items.map((item: { sku: string; name: string; priceCents: number; quantity: number }) => {
      const product = dbProducts?.find((p) => p.sku === item.sku);
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

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail || "",
        customer_phone: customerPhone || "",
        status: "paid",
        subtotal_cents: totalCents,
        payment_method: paymentMethod,
        source: "in_person",
        organization: organization || null,
        check_number: paymentMethod === "check" ? checkNumber : null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Manual order error:", orderError);
      return NextResponse.json({ error: "Failed to create order: " + orderError.message }, { status: 500 });
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
