"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { ArrowLeft, Heart, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";

const squareAppId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT || "sandbox";

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [orgs, setOrgs] = useState<{ id: string; name: string; slug: string; logo_url: string | null }[]>([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const cardRef = useRef<unknown>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
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
    quantity: i.quantity,
  }));

  const initializeSquare = useCallback(async () => {
    if (!squareAppId || !cardContainerRef.current || cardRef.current) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payments = (window as any).Square?.payments(squareAppId, squareEnv === "production" ? undefined : "sandbox");
      if (!payments) return;

      const card = await payments.card();
      await card.attach(cardContainerRef.current);
      cardRef.current = card;
      setSdkReady(true);
    } catch (err) {
      console.error("Square SDK init error:", err);
    }
  }, []);

  useEffect(() => {
    if (sdkReady || !squareAppId) return;
    // Try to init if script already loaded
    initializeSquare();
  }, [sdkReady, initializeSquare]);

  const handlePay = async () => {
    if (!cardRef.current || !customerInfoValid) return;
    setProcessing(true);
    setError("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (cardRef.current as any).tokenize();
      if (result.status !== "OK") {
        setError("Card validation failed. Please check your card details.");
        setProcessing(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: result.token,
          items: cartPayload,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          organization,
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push("/checkout/success");
      } else {
        setError(data.error || "Payment failed. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setProcessing(false);
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
      <Script
        src={squareEnv === "production" ? "https://web.squarecdn.com/v1/square.js" : "https://sandbox.web.squarecdn.com/v1/square.js"}
        strategy="afterInteractive"
        onLoad={initializeSquare}
      />

      <Link
        href="/cart"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="font-display text-3xl font-bold text-earth-900 mb-2">Checkout</h1>
      <p className="text-earth-500 mb-8">
        Fill in your details and enter your payment information below.
      </p>

      {/* Order summary */}
      <div className="bg-earth-50 rounded-xl p-4 mb-8">
        <h2 className="font-semibold text-earth-900 mb-3">Order Summary</h2>
        <div className="space-y-1 text-sm">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between text-earth-700">
              <span>
                {item.name} x{item.quantity}
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

      {/* Payment */}
      <div className={`space-y-4 ${!customerInfoValid ? "opacity-50 pointer-events-none" : ""}`}>
        <h2 className="font-semibold text-earth-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-earth-500" />
          Payment
        </h2>

        <div className="bg-white border border-earth-200 rounded-xl p-5">
          {squareAppId ? (
            <>
              <div
                ref={cardContainerRef}
                id="card-container"
                className="mb-4"
                style={{ minHeight: 89 }}
              />

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={processing || !sdkReady}
                className="w-full flex items-center justify-center gap-2 bg-garden-600 hover:bg-garden-700 text-white font-semibold py-3 rounded-full transition-colors shadow-md disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {processing ? "Processing..." : `Pay ${formatCurrency(totalCents)}`}
              </button>
            </>
          ) : (
            <p className="text-earth-500 text-sm text-center py-4">
              Payment is not configured yet. Please check back soon.
            </p>
          )}
        </div>

        <p className="text-xs text-earth-400 text-center">
          Your payment is processed securely by Square. We never see your card details.
        </p>
      </div>
    </div>
  );
}
