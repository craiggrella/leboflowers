"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { useRouter } from "next/navigation";
import type { Product, Category } from "@/types";
import { FileText, Plus, Minus, Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PosItem {
  productId: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export default function PosManualPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [orgs, setOrgs] = useState<{ name: string; logo_url: string | null }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "check">("cash");
  const [checkNumber, setCheckNumber] = useState("");
  const [items, setItems] = useState<PosItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [prodsRes, catsRes, orgsRes] = await Promise.all([
        supabase.from("products").select("*").order("name"),
        supabase.from("categories").select("*").order("sort_order"),
        fetch("/api/organizations").then((r) => r.json()),
      ]);
      setProducts((prodsRes.data as Product[]) || []);
      setCategories((catsRes.data as Category[]) || []);
      setOrgs(orgsRes.organizations || []);
    }
    load();
  }, []);

  const filtered = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const addProduct = (product: Product) => {
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

  const handleRecord = async () => {
    if (!customerName.trim() || items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/pos/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerEmail, customerPhone, organization, paymentMethod, checkNumber, items }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/orders");
      } else {
        setError(data.error || "Failed to record transaction");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-2">Add Order (Cash/Check)</h1>
      <p className="text-earth-500 text-sm mb-6">Record a payment made with cash or check.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Product selection — same as POS card */}
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

        {/* Payment panel */}
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <h2 className="font-semibold text-earth-900 mb-3">Customer & Payment</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                placeholder="Customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                placeholder="customer@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Phone</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(formatPhone(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                placeholder="412-555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Supporting Organization *</label>
              <div className="space-y-2">
                {orgs.map((org) => (
                  <button
                    key={org.name}
                    type="button"
                    onClick={() => setOrganization(org.name)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left border ${
                      organization === org.name
                        ? "bg-garden-600 text-white border-garden-600"
                        : "bg-white text-earth-600 border-earth-200 hover:border-earth-300"
                    }`}
                  >
                    {org.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Payment Method</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                    paymentMethod === "cash"
                      ? "bg-garden-600 text-white border-garden-600"
                      : "bg-white text-earth-600 border-earth-200"
                  }`}
                >
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod("check")}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                    paymentMethod === "check"
                      ? "bg-garden-600 text-white border-garden-600"
                      : "bg-white text-earth-600 border-earth-200"
                  }`}
                >
                  Check
                </button>
              </div>
            </div>

            {paymentMethod === "check" && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Check Number</label>
                <input
                  type="text"
                  value={checkNumber}
                  onChange={(e) => setCheckNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  placeholder="Check #"
                />
              </div>
            )}
          </div>

          <div className="bg-earth-50 rounded-lg p-4 my-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-earth-900">Total</span>
              <span className="text-2xl font-bold text-garden-700">{formatCurrency(total)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleRecord}
            disabled={loading || items.length === 0 || !customerName.trim() || !organization}
            className="w-full flex items-center justify-center gap-2 bg-garden-600 hover:bg-garden-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {loading ? "Recording..." : `Record ${paymentMethod === "cash" ? "Cash" : "Check"} Payment`}
          </button>
        </div>
      </div>
    </div>
  );
}
