"use client";

import { useState } from "react";
import { Download, Printer, Eye } from "lucide-react";
import Link from "next/link";

// TODO: Replace with Supabase query
const mockOrders = [
  { id: "1", order_number: 1001, customer_name: "Jane Doe", customer_email: "jane@example.com", status: "paid", subtotal_cents: 5100, payment_method: "online_card", source: "online", created_at: "2026-03-15T10:30:00Z" },
  { id: "2", order_number: 1002, customer_name: "Bob Smith", customer_email: "bob@example.com", status: "fulfilled", subtotal_cents: 3400, payment_method: "cash", source: "in_person", created_at: "2026-03-15T11:00:00Z" },
];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? mockOrders : mockOrders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900">Orders</h1>
        <a
          href="/api/admin/export"
          className="inline-flex items-center gap-2 bg-garden-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-garden-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export for Dean&apos;s
        </a>
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
              <th className="text-left px-4 py-3 font-medium text-earth-600">Source</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                <td className="px-4 py-3 font-mono">{order.order_number}</td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      order.status === "paid"
                        ? "bg-garden-100 text-garden-700"
                        : order.status === "fulfilled"
                        ? "bg-sunshine-100 text-sunshine-600"
                        : order.status === "cancelled"
                        ? "bg-rose-100 text-rose-600"
                        : "bg-earth-100 text-earth-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  ${(order.subtotal_cents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-earth-500 capitalize">{order.source.replace("_", " ")}</td>
                <td className="px-4 py-3 text-earth-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-garden-600 hover:text-garden-700"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="text-earth-400 hover:text-earth-600" title="Print">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-earth-500 text-sm">No orders found.</div>
        )}
      </div>
    </div>
  );
}
