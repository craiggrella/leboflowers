import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Public route — checkout page needs this
export async function GET() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return NextResponse.json({ organizations: data || [] });
}
