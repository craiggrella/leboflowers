"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShoppingBag, DollarSign, Package, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<
    { id: string; order_number: number; customer_name: string; subtotal_cents: number; status: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [ordersRes, productsRes, pendingRes, recentRes] = await Promise.all([
        supabase.from("orders").select("subtotal_cents"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("id, order_number, customer_name, subtotal_cents, status, created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      const orders = ordersRes.data || [];
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.subtotal_cents, 0),
        totalProducts: productsRes.count || 0,
        pendingOrders: pendingRes.count || 0,
      });
      setRecentOrders(recentRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-garden-100 text-garden-700" },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "bg-sunshine-100 text-sunshine-600" },
    { label: "Products", value: stats.totalProducts.toString(), icon: Package, color: "bg-lavender-100 text-lavender-600" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: Clock, color: "bg-petal-100 text-petal-600" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-earth-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-earth-900">
              {loading ? "..." : stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-earth-500 text-sm">Loading...</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-earth-500 text-sm">No orders yet. They&apos;ll show up here once customers start ordering!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-earth-100">
              <tr>
                <th className="text-left pb-2 font-medium text-earth-600">#</th>
                <th className="text-left pb-2 font-medium text-earth-600">Customer</th>
                <th className="text-left pb-2 font-medium text-earth-600">Total</th>
                <th className="text-left pb-2 font-medium text-earth-600">Status</th>
                <th className="text-left pb-2 font-medium text-earth-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-earth-50">
                  <td className="py-2 font-mono">{order.order_number}</td>
                  <td className="py-2">{order.customer_name}</td>
                  <td className="py-2">{formatCurrency(order.subtotal_cents)}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      order.status === "paid" ? "bg-garden-100 text-garden-700"
                        : order.status === "fulfilled" ? "bg-sunshine-100 text-sunshine-600"
                        : order.status === "cancelled" ? "bg-rose-100 text-rose-600"
                        : "bg-earth-100 text-earth-600"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 text-earth-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
