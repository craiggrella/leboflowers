"use client";

import { useState } from "react";
import { products as allProducts, categories } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900">Products</h1>
        <span className="text-sm text-earth-500">{allProducts.length} total products</span>
      </div>

      <input
        type="text"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm px-4 py-2 rounded-lg border border-earth-200 text-sm mb-4 focus:ring-2 focus:ring-garden-400 focus:border-transparent"
      />

      <div className="bg-white rounded-xl border border-earth-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-earth-50 border-b border-earth-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-earth-600">SKU</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Unit</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const cat = categories.find((c) => c.id === product.category_id);
              return (
                <tr key={product.id} className="border-b border-earth-50 hover:bg-earth-50/50">
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-earth-500">{cat?.name}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price_cents)}</td>
                  <td className="px-4 py-3 text-earth-500">{product.unit_label}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.in_stock
                          ? "bg-garden-100 text-garden-700"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {product.in_stock ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
