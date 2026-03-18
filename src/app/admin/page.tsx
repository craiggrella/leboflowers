"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, DollarSign, Package, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

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
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalOrders: data.totalOrders,
          totalRevenue: data.totalRevenue,
          totalProducts: data.totalProducts,
          pendingOrders: data.pendingOrders,
        });
        setRecentOrders(data.recentOrders);
        setLoading(false);
      });
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-garden-100 text-garden-700", href: "/admin/orders" },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: "bg-sunshine-100 text-sunshine-600", href: "/admin/reports" },
    { label: "Products", value: stats.totalProducts.toString(), icon: Package, color: "bg-lavender-100 text-lavender-600", href: "/admin/products" },
    { label: "Pending Orders", value: stats.pendingOrders.toString(), icon: Clock, color: "bg-petal-100 text-petal-600", href: "/admin/orders?status=pending" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm hover:shadow-md hover:border-garden-200 transition-all cursor-pointer block">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-earth-500">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-bold text-earth-900">
              {loading ? "..." : stat.value}
            </span>
          </Link>
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
