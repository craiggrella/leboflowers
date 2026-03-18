import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type AdminRole = "super_admin" | "admin" | "volunteer";

interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: AdminRole;
}

/**
 * Verify the current request is from an authenticated admin user.
 * Returns the admin user info or null if unauthorized.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Look up in admin_users table using service role (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: adminUser } = await adminClient
      .from("admin_users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (!adminUser) return null;

    // Link user_id if not set yet (first login)
    if (!adminUser.user_id) {
      await adminClient
        .from("admin_users")
        .update({ user_id: user.id })
        .eq("id", adminUser.id);
      adminUser.user_id = user.id;
    }

    return adminUser as AdminUser;
  } catch {
    return null;
  }
}

/**
 * Check if user has write permissions (super_admin or admin)
 */
export function canWrite(role: AdminRole): boolean {
  return role === "super_admin" || role === "admin";
}

/**
 * Check if user can manage users (super_admin or admin, with restrictions)
 */
export function canManageUsers(role: AdminRole): boolean {
  return role === "super_admin" || role === "admin";
}

/**
 * Check if user can delete (super_admin only)
 */
export function canDelete(role: AdminRole): boolean {
  return role === "super_admin";
}
