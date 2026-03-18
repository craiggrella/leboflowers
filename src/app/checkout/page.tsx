"use client";

import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { ArrowLeft, Lock, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const stripeEnabled = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== "pk_test_placeholder";

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [orgs, setOrgs] = useState<{ id: string; name: string; slug: string; logo_url: string | null }[]>([]);
  const [error, setError] = useState("");
  const [stripeLoading, setStripeLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/organizations")
      .then((r) => r.json())
      .then((data) => setOrgs(data.organizations || []));
  }, []);

  const customerInfoValid = name.trim() && email.trim() && organization;

  const cartPayload = items.map((i) => ({
    productId: i.productId,
    sku: i.sku,
    name: i.name,
    priceCents: i.priceCents,
    quantity: i.quantity,
  }));

  // Stripe checkout (redirect flow)
  const handleStripeCheckout = async () => {
    setStripeLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartPayload,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          organization,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong.");
        setStripeLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setStripeLoading(false);
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
        Fill in your details, then choose your payment method below.
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

      {/* Customer info */}
      <div className="space-y-4 mb-8">
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
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className="w-full px-4 py-2.5 rounded-lg border border-earth-200 focus:ring-2 focus:ring-garden-400 focus:border-transparent text-sm"
            placeholder="412-555-0123"
          />
        </div>
      </div>

      {/* Organization selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-earth-700 mb-3">
          <Heart className="w-4 h-4 inline mr-1 text-rose-500" />
          Which organization are you supporting? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {orgs.map((org) => (
            <button
              key={org.slug}
              type="button"
              onClick={() => setOrganization(org.name)}
              className={`relative rounded-xl border-2 overflow-hidden transition-all aspect-square ${
                organization === org.name
                  ? "border-garden-500 shadow-lg ring-2 ring-garden-200"
                  : "border-earth-200 hover:border-earth-300"
              }`}
            >
              {org.logo_url ? (
                <img src={org.logo_url} alt={org.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-earth-100" />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-10 pb-3 px-3">
                <span className="text-white text-sm font-bold drop-shadow-lg block text-center">
                  {org.name}
                </span>
              </div>
              {organization === org.name && (
                <div className="absolute top-2 right-2 bg-garden-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {/* Payment options — always visible but disabled if info incomplete */}
      <div className={`space-y-4 ${!customerInfoValid ? "opacity-50 pointer-events-none" : ""}`}>
        <h2 className="font-semibold text-earth-900">Choose Payment Method</h2>

          {/* PayPal */}
          {paypalClientId && paypalClientId !== "PAYPAL_CLIENT_ID_PLACEHOLDER" ? (
            <div className="bg-white border border-earth-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-earth-700 mb-3">Pay with PayPal</h3>
              <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "pill", label: "pay" }}
                  createOrder={async () => {
                    const res = await fetch("/api/paypal/create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        items: cartPayload,
                        customerName: name,
                        customerEmail: email,
                        customerPhone: phone,
                        organization,
                      }),
                    });
                    const data = await res.json();
                    if (data.error) throw new Error(data.error);
                    return data.orderID;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("/api/paypal/capture", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        customerName: name,
                        customerEmail: email,
                        customerPhone: phone,
                        organization,
                        items: cartPayload,
                      }),
                    });
                    const result = await res.json();
                    if (result.success) {
                      clearCart();
                      router.push("/checkout/success");
                    } else {
                      setError(result.error || "Payment failed");
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setError("PayPal payment failed. Please try again.");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          ) : (
            <div className="bg-earth-50 border border-earth-200 rounded-xl p-5 text-center text-earth-500 text-sm">
              PayPal is not configured yet. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to enable.
            </div>
          )}

          {/* Stripe (if enabled) */}
          {stripeEnabled && (
            <div className="bg-white border border-earth-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-earth-700 mb-3">Pay with Card (Stripe)</h3>
              <button
                onClick={handleStripeCheckout}
                disabled={stripeLoading}
                className="w-full flex items-center justify-center gap-2 bg-earth-900 hover:bg-earth-800 text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {stripeLoading ? "Redirecting..." : `Pay ${formatCurrency(totalCents)} with Card`}
              </button>
            </div>
          )}

          <p className="text-xs text-earth-400 text-center">
            Your payment is processed securely. We never see your payment details.
          </p>
        </div>
    </div>
  );
}
