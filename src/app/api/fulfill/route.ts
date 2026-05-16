import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Public endpoint — volunteers scan a printed QR code to fulfill an order at
// pickup. No login required by design. The order ID is an unguessable UUID,
// and the only mutation allowed here is flipping status to "fulfilled".

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing order ID" }, { status: 400 });

  const supabase = createAdminClient();
  const [orderRes, itemsRes] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, order_number, customer_name, customer_phone, subtotal_cents, status, payment_method, check_number, created_at"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("order_items")
      .select("id, sku, product_name, price_cents, quantity")
      .eq("order_id", id),
  ]);

  if (!orderRes.data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order: orderRes.data, items: itemsRes.data || [] });
}

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing order ID" }, { status: 400 });

  const supabase = createAdminClient();
  // Only ever set status to "fulfilled" — no other field is mutable here.
  const { error } = await supabase
    .from("orders")
    .update({ status: "fulfilled" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
