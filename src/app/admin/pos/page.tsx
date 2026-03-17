"use client";

import { useState } from "react";
import { products, categories } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Plus, Minus, Trash2, Search } from "lucide-react";

interface PosItem {
  productId: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export default function PosCardPage() {
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<PosItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const addProduct = (product: (typeof products)[0]) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { productId: product.id, sku: product.sku, name: product.name, priceCents: product.price_cents, quantity: 1 },
      ];
    });
    setSearch("");
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } else {
      setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)));
    }
  };

  const total = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  const handleCharge = async () => {
    if (!customerName.trim() || items.length === 0) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/pos/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, items }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        // In a full implementation, you'd use Stripe Elements here
        setMessage("Payment intent created. Stripe Elements integration needed for card input.");
      } else {
        setMessage(data.error || "Failed to create payment");
      }
    } catch {
      setMessage("Network error");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-2">In-Person Card Payment</h1>
      <p className="text-earth-500 text-sm mb-6">Charge a customer&apos;s card for walk-in purchases.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product selection */}
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <h2 className="font-semibold text-earth-900 mb-3">Add Products</h2>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
            />
          </div>

          {filtered.length > 0 && (
            <div className="border border-earth-200 rounded-lg max-h-64 overflow-y-auto mb-4">
              {filtered.slice(0, 20).map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-garden-50 border-b border-earth-50 last:border-0 text-left text-sm"
                  >
                    <div>
                      <span className="font-mono text-xs text-earth-500 mr-2">{p.sku}</span>
                      <span className="text-earth-900">{p.name}</span>
                      <span className="text-earth-400 text-xs ml-2">{cat?.name}</span>
                    </div>
                    <span className="text-garden-700 font-medium">{formatCurrency(p.price_cents)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Cart items */}
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between bg-earth-50 rounded-lg px-3 py-2">
                <div className="text-sm">
                  <span className="font-mono text-xs text-earth-500 mr-1">{item.sku}</span>
                  <span className="text-earth-900">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center border border-earth-200 rounded bg-white">
                    <button onClick={() => updateQty(item.productId, item.quantity - 1)} className="p-1">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(item.productId, item.quantity + 1)} className="p-1">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium w-16 text-right">
                    {formatCurrency(item.priceCents * item.quantity)}
                  </span>
                  <button onClick={() => updateQty(item.productId, 0)} className="text-earth-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charge panel */}
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <h2 className="font-semibold text-earth-900 mb-3">Customer & Payment</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-earth-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
              placeholder="Customer name"
            />
          </div>

          <div className="bg-earth-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-earth-900">Total</span>
              <span className="text-2xl font-bold text-garden-700">{formatCurrency(total)}</span>
            </div>
            <p className="text-xs text-earth-500 mt-1">{items.length} items</p>
          </div>

          {message && (
            <div className="bg-sunshine-50 border border-sunshine-200 text-earth-700 px-4 py-3 rounded-lg text-sm mb-4">
              {message}
            </div>
          )}

          <button
            onClick={handleCharge}
            disabled={loading || items.length === 0 || !customerName.trim()}
            className="w-full flex items-center justify-center gap-2 bg-garden-600 hover:bg-garden-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? "Processing..." : `Charge ${formatCurrency(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
