"use client";

import { useState, useMemo } from "react";
import type { Product, Category } from "@/types";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
}

export default function CatalogPage({ products, categories }: CatalogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return result;
  }, [products, categories, selectedCategory, searchQuery]);

  // Get category name for section heading
  const categoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : null;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-earth-900">
            {categoryName ?? "All Products"}
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      <ProductGrid products={filtered} />
    </div>
  );
}
