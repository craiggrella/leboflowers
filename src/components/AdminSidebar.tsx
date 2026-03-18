"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, LogOut, Menu, X, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, minRole: "volunteer" as const },
  { href: "/admin/products", label: "Products", icon: Package, minRole: "volunteer" as const },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, minRole: "volunteer" as const },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, minRole: "volunteer" as const },
  { href: "/admin/settings", label: "Settings", icon: Settings, minRole: "admin" as const },
];

const roleHierarchy = { super_admin: 3, admin: 2, volunteer: 1 };

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setRole(data.user.role);
        } else {
          router.push("/login");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const visibleItems = navItems.filter((item) => {
    const userLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[item.minRole];
    return userLevel >= requiredLevel;
  });

  const roleBadge = role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Volunteer";

  const sidebarContent = (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-white">Admin Panel</h2>
            <p className="text-xs text-earth-400">{roleBadge}</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-earth-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-garden-600 text-white"
                  : "hover:bg-earth-800 text-earth-300"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-earth-700 pt-3 mt-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-earth-400 hover:bg-earth-800 hover:text-earth-200 transition-colors"
        >
          View Store
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-earth-400 hover:bg-earth-800 hover:text-earth-200 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-[1.1rem] right-4 z-50 bg-earth-900 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-52 bg-earth-900 text-earth-200 p-4 flex flex-col transform transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      <aside className="hidden lg:block w-52 bg-earth-900 text-earth-200 p-4 shrink-0">
        <div className="sticky top-20">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
