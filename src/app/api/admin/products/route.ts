import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canWrite } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(admin.role)) return NextResponse.json({ error: "Read-only access" }, { status: 403 });

  const { id, ...updates } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
