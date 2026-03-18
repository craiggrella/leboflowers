import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const [ordersRes, productsRes, pendingRes, recentRes] = await Promise.all([
    supabase.from("orders").select("subtotal_cents"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("id, order_number, customer_name, subtotal_cents, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const orders = ordersRes.data || [];

  return NextResponse.json({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.subtotal_cents, 0),
    totalProducts: productsRes.count || 0,
    pendingOrders: pendingRes.count || 0,
    recentOrders: recentRes.data || [],
  });
}
