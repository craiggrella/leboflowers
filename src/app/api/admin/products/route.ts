import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canWrite } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const [prodsRes, catsRes, itemsRes] = await Promise.all([
    supabase.from("products").select("*").order("category_id").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("order_items").select("product_id, quantity"),
  ]);

  // Aggregate sold counts
  const soldCounts: Record<string, number> = {};
  for (const item of (itemsRes.data || [])) {
    if (item.product_id) {
      soldCounts[item.product_id] = (soldCounts[item.product_id] || 0) + item.quantity;
    }
  }

  const products = (prodsRes.data || []).map((p) => ({
    ...p,
    sold_count: soldCounts[p.id] || 0,
  }));

  return NextResponse.json({
    products,
    categories: catsRes.data || [],
  });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(admin.role)) return NextResponse.json({ error: "Read-only access" }, { status: 403 });

  const { id, ...updates } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
