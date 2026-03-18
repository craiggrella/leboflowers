import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = createAdminClient();

  const orderId = req.nextUrl.searchParams.get("id");

  if (orderId) {
    const [orderRes, itemsRes] = await Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).single(),
      supabase.from("order_items").select("*").eq("order_id", orderId),
    ]);
    return NextResponse.json({ order: orderRes.data, items: itemsRes.data });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
