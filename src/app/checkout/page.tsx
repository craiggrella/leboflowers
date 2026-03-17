"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalCents } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            sku: i.sku,
            name: i.name,
            priceCents: i.priceCents,
            quantity: i.quantity,
          })),
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-earth-900 mb-4">No Items to Checkout</h1>
        <Link href="/#shop" className="text-garden-600 hover:text-garden-700 font-medium">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold text-earth-900 mb-2">Checkout</h1>
      <p className="text-earth-500 mb-8">
        Fill in your details below. You&apos;ll be redirected to Stripe to complete payment securely.
      </p>

      {/* Order summary */}
      <div className="bg-earth-50 rounded-xl p-4 mb-8">
        <h2 className="font-semibold text-earth-900 mb-3">Order Summary</h2>
        <div className="space-y-1 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-earth-700">
              <span>
                {item.sku} - {item.name} x{item.quantity}
              </span>
              <span>{formatCurrency(item.priceCents * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-earth-200 mt-3 pt-3 flex justify-between font-bold text-earth-900">
          <span>Total</span>
          <span className="text-garden-700">{formatCurrency(totalCents)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-earth-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-1">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-earth-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
            placeholder="(412) 555-0123"
          />
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-garden-600 hover:bg-garden-700 text-white font-semibold py-3 rounded-full transition-colors shadow-md disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {loading ? "Redirecting to payment..." : `Pay ${formatCurrency(totalCents)}`}
        </button>

        <p className="text-xs text-earth-400 text-center">
          Payments are processed securely through Stripe. We never see your card details.
        </p>
      </form>
    </div>
  );
}
