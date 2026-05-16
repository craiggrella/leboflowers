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
      <div className="flex items-center justify-center p-8">
        <p className="text-earth-500">No order ID provided.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-earth-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-earth-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-5">
        <Flower2 className="w-8 h-8 text-rose-500 mx-auto mb-1" />
        <p className="text-earth-500 text-xs uppercase tracking-wider font-medium">Order Fulfillment</p>
      </div>

      {/* Big order number + customer */}
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl font-bold text-earth-900">#{order.order_number}</h1>
        <p className="text-xl text-earth-700 mt-1">{order.customer_name}</p>
        {order.customer_phone && (
          <p className="text-sm text-earth-500 mt-0.5">{order.customer_phone}</p>
        )}
      </div>

      {/* Fulfill Button — THE FOCUS */}
      <div className="mb-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm mb-3">
            {error}
          </div>
        )}

        {fulfilled ? (
          <div className="flex flex-col items-center justify-center gap-3 bg-garden-50 border-2 border-garden-300 text-garden-700 px-6 py-8 rounded-2xl text-center">
            <CheckCircle className="w-12 h-12" />
            <span className="font-bold text-2xl">Fulfilled!</span>
            <span className="text-sm text-garden-600">This order has been picked up.</span>
          </div>
        ) : (
          <button
            onClick={handleFulfill}
            disabled={fulfilling}
            className="w-full flex items-center justify-center gap-3 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold py-6 rounded-2xl text-xl transition-colors disabled:opacity-50 shadow-lg shadow-rose-200"
          >
            <Package className="w-7 h-7" />
            {fulfilling ? "Updating..." : "Mark as Fulfilled"}
          </button>
        )}
      </div>

      {/* Order details below the button */}
      <div className="bg-white rounded-xl border border-earth-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-earth-50 border-b border-earth-200 flex justify-between items-center">
          <span className="text-sm font-medium text-earth-700">Order Items</span>
          <span className="text-sm font-bold text-garden-700">{formatCurrency(order.subtotal_cents)}</span>
        </div>
        <div className="p-4 space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-earth-700">
                <span className="font-mono text-xs text-earth-400 mr-1">{item.sku}</span>
                {item.product_name}
                <span className="text-earth-400"> x{item.quantity}</span>
              </span>
              <span className="font-medium text-earth-900">{formatCurrency(item.price_cents * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-earth-50 border-t border-earth-200 text-xs text-earth-500 space-y-0.5">
          <p>Payment: {order.payment_method.replace(/_/g, " ")}{order.check_number ? ` #${order.check_number}` : ""}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
