"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetailClient({
  product,
  categoryName,
}: {
  product: Product;
  categoryName: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        priceCents: product.price_cents,
        imageUrl: product.image_url,
        unitLabel: product.unit_label,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container py-8">
      <Link
        href="/#shop"
        className="inline-flex items-center gap-1.5 text-garden-600 hover:text-garden-700 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square bg-earth-50 rounded-2xl overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-earth-300">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-garden-100 text-garden-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.sku}
            </span>
            <span className="text-earth-500 text-sm">{categoryName}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-earth-900 mb-3">
            {product.name}
          </h1>

          <p className="text-earth-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-garden-700">
              {formatCurrency(product.price_cents)}
            </span>
            <span className="text-earth-500 text-sm">per {product.unit_label}</span>
          </div>

          {product.in_stock ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-earth-600 font-medium">Qty:</span>
                <div className="inline-flex items-center border border-earth-200 rounded-full">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 text-earth-600 hover:text-earth-900"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2 text-earth-600 hover:text-earth-900"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all shadow-md ${
                  added
                    ? "bg-garden-500"
                    : "bg-garden-600 hover:bg-garden-700 hover:shadow-lg"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="mt-6 bg-earth-100 text-earth-600 px-6 py-3 rounded-full inline-block font-medium">
              Currently Sold Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
