"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      priceCents: product.price_cents,
      imageUrl: product.image_url,
      unitLabel: product.unit_label,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-earth-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square bg-earth-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-earth-300">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-garden-700 px-2.5 py-1 rounded-full">
            {product.sku}
          </span>
        </div>
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-earth-800 font-semibold px-4 py-2 rounded-full text-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-earth-900 text-sm leading-snug group-hover:text-garden-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-earth-500 mt-0.5">{product.unit_label}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-garden-700">
            {formatCurrency(product.price_cents)}
          </span>
          {product.in_stock && (
            <button
              onClick={handleAdd}
              className="bg-garden-500 hover:bg-garden-600 text-white p-2 rounded-full transition-colors shadow-sm hover:shadow"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
