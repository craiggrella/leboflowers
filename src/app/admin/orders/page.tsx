"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, Eye, Plus, Printer } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import type { Order } from "@/types";

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900">Orders</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/pos/manual"
            className="inline-flex items-center gap-2 bg-garden-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-garden-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Order
          </Link>
          <a
            href="/api/admin/orders/print-all?status=paid"
            target="_blank"
            className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-earth-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print All Slips
          </a>
          <a
            href="/api/admin/export"
            className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-earth-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export for Dean&apos;s
          </a>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "pending", "paid", "fulfilled", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
              statusFilter === s ? "bg-garden-600 text-white" : "bg-white border border-earth-200 text-earth-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-earth-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Total</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Payment</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Organization</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                <td className="px-4 py-3 font-mono">{order.order_number}</td>
                <td className="px-4 py-3">
                  <div>{order.customer_name}</div>
                  {order.customer_email && (
                    <div className="text-xs text-earth-400">{order.customer_email}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      order.status === "paid" ? "bg-garden-100 text-garden-700"
                        : order.status === "fulfilled" ? "bg-sunshine-100 text-sunshine-600"
                        : order.status === "cancelled" ? "bg-rose-100 text-rose-600"
                        : "bg-earth-100 text-earth-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{formatCurrency(order.subtotal_cents)}</td>
                <td className="px-4 py-3 text-earth-500 text-xs capitalize">
                  {order.payment_method.replace(/_/g, " ")}
                  {order.check_number && ` #${order.check_number}`}
                </td>
                <td className="px-4 py-3 text-earth-500 text-xs">{order.organization || "—"}</td>
                <td className="px-4 py-3 text-earth-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-garden-600 hover:text-garden-700"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-8 text-earth-500 text-sm">Loading orders...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-8 text-earth-500 text-sm">No orders found.</div>
        )}
      </div>
    </div>
  );
}
