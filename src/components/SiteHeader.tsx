"use client";

import Link from "next/link";
import { ShoppingCart, Flower2, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function SiteHeader() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-garden-100 shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <Flower2 className="w-8 h-8 text-rose-500 group-hover:text-rose-600 transition-colors" />
          <div className="leading-tight">
            <span className="font-display text-xl font-bold text-garden-800 block">
              Mt. Lebanon
            </span>
            <span className="text-xs text-earth-700 tracking-wide uppercase">
              Flower Sale
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="text-earth-700 hover:text-garden-600 transition-colors">
            Shop
          </Link>
          <Link href="/cart" className="text-earth-700 hover:text-garden-600 transition-colors">
            Cart
          </Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1.5 bg-garden-600 hover:bg-garden-700 text-white px-4 py-2 rounded-full transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-garden-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-earth-700">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-garden-100 bg-white px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block text-earth-700 hover:text-garden-600 py-1"
          >
            Shop All
          </Link>
          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="block text-earth-700 hover:text-garden-600 py-1"
          >
            View Cart
          </Link>
        </nav>
      )}
    </header>
  );
}
