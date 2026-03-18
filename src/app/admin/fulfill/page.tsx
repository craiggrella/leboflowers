"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, Flower2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order, OrderItem } from "@/types";

export default function FulfillPage() {
  return (
    <Suspense>
      <FulfillContent />
    </Suspense>
  );
}

function FulfillContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fulfilling, setFulfilling] = useState(false);
  const [fulfilled, setFulfilled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/orders?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order as Order);
        setItems((data.items as OrderItem[]) || []);
        if (data.order?.status === "fulfilled") setFulfilled(true);
        setLoading(false);
      });
  }, [id]);

  const handleFulfill = async () => {
    if (!id) return;
    setFulfilling(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "fulfilled" }),
      });
      const result = await res.json();
      if (result.success) {
        setFulfilled(true);
        setOrder((prev) => prev ? { ...prev, status: "fulfilled" } : prev);
      } else {
        setError(result.error || "Failed to update");
      }
    } catch {
      setError("Network error");
    }
    setFulfilling(false);
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-earth-500">No order ID provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-earth-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-earth-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <Flower2 className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h1 className="font-display text-xl font-bold text-earth-900">Mt. Lebanon Flower Sale</h1>
        <p className="text-earth-500 text-xs">Order Fulfillment</p>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-2xl border border-earth-200 shadow-md overflow-hidden">
        <div className="bg-garden-700 text-white px-5 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Order #{order.order_number}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              fulfilled ? "bg-white/20" : "bg-sunshine-400 text-earth-900"
            }`}>
              {fulfilled ? "Fulfilled" : order.status}
            </span>
          </div>
          <p className="text-garden-100 text-sm mt-1">{order.customer_name}</p>
        </div>

        <div className="p-5">
          {/* Items */}
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-earth-700">
                  <span className="font-mono text-xs text-earth-400 mr-1">{item.sku}</span>
                  {item.product_name} x{item.quantity}
                </span>
                <span className="font-medium">{formatCurrency(item.price_cents * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-earth-200 pt-3 flex justify-between font-bold text-earth-900">
            <span>Total</span>
            <span className="text-garden-700">{formatCurrency(order.subtotal_cents)}</span>
          </div>

          {/* Contact */}
          {(order.customer_email || order.customer_phone) && (
            <div className="mt-4 text-xs text-earth-500 space-y-0.5">
              {order.customer_email && <p>{order.customer_email}</p>}
              {order.customer_phone && <p>{order.customer_phone}</p>}
            </div>
          )}
        </div>

        {/* Fulfill Button */}
        <div className="px-5 pb-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm mb-3">
              {error}
            </div>
          )}

          {fulfilled ? (
            <div className="flex items-center justify-center gap-2 bg-garden-50 border border-garden-200 text-garden-700 px-4 py-4 rounded-xl text-center">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Order Fulfilled!</span>
            </div>
          ) : (
            <button
              onClick={handleFulfill}
              disabled={fulfilling}
              className="w-full flex items-center justify-center gap-2 bg-garden-600 hover:bg-garden-700 text-white font-bold py-4 rounded-xl text-lg transition-colors disabled:opacity-50"
            >
              <Package className="w-5 h-5" />
              {fulfilling ? "Updating..." : "Mark as Fulfilled"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
