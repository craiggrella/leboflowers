"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Flower2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container py-16 text-center max-w-lg">
      <div className="bg-garden-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-garden-600" />
      </div>

      <h1 className="font-display text-3xl font-bold text-earth-900 mb-3">
        Thank You for Your Order!
      </h1>

      <p className="text-earth-600 leading-relaxed mb-6">
        Your payment was successful and your order has been placed.
        You&apos;ll receive a confirmation email shortly with pickup details.
      </p>

      <div className="bg-sunshine-50 border border-sunshine-200 rounded-xl p-4 mb-8">
        <div className="flex items-center justify-center gap-2 text-earth-800">
          <Flower2 className="w-5 h-5 text-petal-500" />
          <span className="font-medium">
            Your support helps our community bloom!
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-garden-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-garden-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
