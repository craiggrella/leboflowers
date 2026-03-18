"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { formatCurrency, formatPhone } from "@/lib/utils";
import Link from "next/link";
import type { Order, OrderItem } from "@/types";

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [orgs, setOrgs] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/orders?id=${id}`).then((r) => r.json()),
      fetch("/api/admin/organizations").then((r) => r.json()),
    ]).then(([orderData, orgData]) => {
      setOrder(orderData.order as Order);
      setItems((orderData.items as OrderItem[]) || []);
      setOrgs(orgData.organizations || []);
      setLoading(false);
    });
  }, [id]);

  const handlePrint = () => window.open(`/api/admin/orders/print?id=${id}`, "_blank");

  const handleStatusChange = async (newStatus: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setOrder((prev) => prev ? { ...prev, status: newStatus as Order["status"] } : prev);
  };

  const handleOrgChange = async (newOrg: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, organization: newOrg || null }),
    });
    setOrder((prev) => prev ? { ...prev, organization: newOrg || null } : prev);
  };

  if (loading) return <div className="text-earth-500">Loading...</div>;
  if (!order) return <div className="text-earth-500">Order not found.</div>;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-6 print:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900">
          Order #{order.order_number}
        </h1>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-earth-100 text-earth-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-earth-200 transition-colors print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print Order Slip
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <h2 className="font-semibold text-earth-900 mb-3">Customer</h2>
          <div className="space-y-1 text-sm text-earth-700">
            <p><strong>Name:</strong> {order.customer_name}</p>
            {order.customer_email && <p><strong>Email:</strong> {order.customer_email}</p>}
            {order.customer_phone && <p><strong>Phone:</strong> {formatPhone(order.customer_phone)}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <h2 className="font-semibold text-earth-900 mb-3">Order Info</h2>
          <div className="space-y-1 text-sm text-earth-700">
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Payment:</strong> {order.payment_method.replace(/_/g, " ")}{order.check_number ? ` #${order.check_number}` : ""}</p>
            <p><strong>Source:</strong> {order.source.replace(/_/g, " ")}</p>
            <div className="flex items-center gap-2 mt-1">
              <strong>Organization:</strong>
              <select
                value={order.organization || ""}
                onChange={(e) => handleOrgChange(e.target.value)}
                className="border border-earth-200 rounded px-2 py-1 text-sm"
              >
                <option value="">Not specified</option>
                {orgs.map((org) => (
                  <option key={org.name} value={org.name}>{org.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-2 print:hidden">
              <strong>Status:</strong>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-earth-200 rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <p className="print:block hidden"><strong>Status:</strong> {order.status}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
        <h2 className="font-semibold text-earth-900 mb-3">Items</h2>
        <table className="w-full text-sm">
          <thead className="border-b border-earth-100">
            <tr>
              <th className="text-left pb-2 font-medium text-earth-600">SKU</th>
              <th className="text-left pb-2 font-medium text-earth-600">Product</th>
              <th className="text-right pb-2 font-medium text-earth-600">Price</th>
              <th className="text-right pb-2 font-medium text-earth-600">Qty</th>
              <th className="text-right pb-2 font-medium text-earth-600">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-earth-50">
                <td className="py-2 font-mono text-xs">{item.sku}</td>
                <td className="py-2">{item.product_name}</td>
                <td className="py-2 text-right">{formatCurrency(item.price_cents)}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right font-medium">{formatCurrency(item.price_cents * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-earth-200 mt-2 pt-3 flex justify-between font-bold text-earth-900">
          <span>Total</span>
          <span className="text-garden-700">{formatCurrency(order.subtotal_cents)}</span>
        </div>
      </div>

      {order.notes && (
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm mt-6">
          <h2 className="font-semibold text-earth-900 mb-2">Notes</h2>
          <p className="text-sm text-earth-700">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
