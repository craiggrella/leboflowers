"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingCart className="w-16 h-16 text-earth-300 mx-auto mb-4" />
        <h1 className="font-display text-3xl font-bold text-earth-900 mb-2">Your Cart is Empty</h1>
        <p className="text-earth-500 mb-6">Add some beautiful flowers to get started!</p>
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 bg-garden-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-garden-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold text-earth-900 mb-8">
        Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 bg-white rounded-xl border border-earth-100 p-4 shadow-sm"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-earth-50 flex-shrink-0">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-earth-300">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-earth-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-earth-500">
                      SKU: {item.sku} &middot; {item.unitLabel}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-earth-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-earth-200 rounded-full">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-earth-600 hover:text-earth-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 text-earth-600 hover:text-earth-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-garden-700">
                    {formatCurrency(item.priceCents * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-garden-50 border border-garden-200 rounded-2xl p-6 sticky top-24">
            <h2 className="font-display text-xl font-bold text-earth-900 mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-earth-700">
                  <span className="truncate mr-2">
                    {item.name} x{item.quantity}
                  </span>
                  <span>{formatCurrency(item.priceCents * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-garden-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-semibold text-earth-900">Total</span>
              <span className="text-2xl font-bold text-garden-700">{formatCurrency(totalCents)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full mt-6 bg-garden-600 hover:bg-garden-700 text-white text-center font-semibold py-3 rounded-full transition-colors shadow-md"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/#shop"
              className="block w-full mt-3 text-center text-garden-600 hover:text-garden-700 text-sm font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
