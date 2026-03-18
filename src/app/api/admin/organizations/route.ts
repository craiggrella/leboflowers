import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canWrite, canDelete } from "@/lib/admin-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const { data } = await supabase.from("organizations").select("*").order("sort_order");
  return NextResponse.json({ organizations: data || [] });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(admin.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, logo_url } = await req.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("organizations").insert({
    name,
    slug: slugify(name),
    logo_url: logo_url || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canWrite(admin.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...updates } = await req.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("organizations").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canDelete(admin.role)) return NextResponse.json({ error: "Only super admins can delete" }, { status: 403 });

  const { id } = await req.json();
  const supabase = createAdminClient();
  // Soft delete — set active to false so historical order data is preserved
  const { error } = await supabase.from("organizations").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
