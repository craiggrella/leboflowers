import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, canManageUsers, canDelete } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageUsers(admin.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data, currentRole: admin.role });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageUsers(admin.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, name, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json({ error: "Email and role required" }, { status: 400 });
  }

  // Admins can't create super_admins
  if (role === "super_admin" && admin.role !== "super_admin") {
    return NextResponse.json({ error: "Only super admins can create super admins" }, { status: 403 });
  }

  const supabase = createAdminClient();

  // Check if email already exists
  const { data: existing } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  // Create Supabase Auth account with temporary password
  const tempPassword = email.split("@")[0] + "Lebo2026!";
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ error: "Failed to create account: " + authError.message }, { status: 500 });
  }

  // Insert into admin_users with the auth user_id linked
  const { error } = await supabase
    .from("admin_users")
    .insert({
      email,
      name: name || "",
      role,
      user_id: authData.user?.id || null,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, tempPassword });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canManageUsers(admin.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, role } = await req.json();

  // Only super_admin can change roles to/from super_admin
  if (role === "super_admin" && admin.role !== "super_admin") {
    return NextResponse.json({ error: "Only super admins can promote to super admin" }, { status: 403 });
  }

  const supabase = createAdminClient();

  // Can't change your own role
  const { data: target } = await supabase.from("admin_users").select("email").eq("id", id).single();
  if (target?.email === admin.email) {
    return NextResponse.json({ error: "Can't change your own role" }, { status: 400 });
  }

  const { error } = await supabase
    .from("admin_users")
    .update({ role })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canDelete(admin.role)) return NextResponse.json({ error: "Only super admins can delete users" }, { status: 403 });

  const { id } = await req.json();

  const supabase = createAdminClient();

  // Can't delete yourself
  const { data: target } = await supabase.from("admin_users").select("email").eq("id", id).single();
  if (target?.email === admin.email) {
    return NextResponse.json({ error: "Can't delete yourself" }, { status: 400 });
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
