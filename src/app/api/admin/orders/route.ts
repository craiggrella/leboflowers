import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canWrite } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status, organization } = await req.json();

  // Volunteers can only mark as fulfilled (QR scan), nothing else
  if (!canWrite(admin.role) && status !== "fulfilled") {
    return NextResponse.json({ error: "Read-only access" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (organization !== undefined) updates.organization = organization;

  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
