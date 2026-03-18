import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const [prodsRes, catsRes] = await Promise.all([
    supabase.from("products").select("*").order("category_id").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  return NextResponse.json({
    products: prodsRes.data || [],
    categories: catsRes.data || [],
  });
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
