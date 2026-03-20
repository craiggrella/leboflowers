"use client";

import { useState, useMemo } from "react";
import type { Product, Category } from "@/types";
import SearchBar from "./SearchBar";
import ProductGrid from "./ProductGrid";
import { cn } from "@/lib/utils";

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
}

export default function CatalogPage({ products, categories }: CatalogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get subcategories for selected category
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = categories.find((c) => c.slug === selectedCategory);
    if (!cat) return [];
    const subs = [...new Set(
      products
        .filter((p) => p.category_id === cat.id && p.subcategory)
        .map((p) => p.subcategory!)
    )];
    return subs.sort();
  }, [products, categories, selectedCategory]);

  const filtered = useMemo(() => {
    let result = products;

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
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
  }, [products, categories, selectedCategory, selectedSubcategory, searchQuery]);

  const categoryName = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.name
    : null;

  const handleCategoryClick = (slug: string | null) => {
    if (slug === selectedCategory) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(slug);
      setSelectedSubcategory(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-earth-900">
            {selectedSubcategory || categoryName || "All Products"}
          </h2>
          <p className="text-earth-500 text-sm mt-1">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            !selectedCategory
              ? "bg-garden-600 text-white shadow-sm"
              : "bg-earth-100 text-earth-700 hover:bg-earth-200"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              cat.slug === selectedCategory
                ? "bg-garden-600 text-white shadow-sm"
                : "bg-earth-100 text-earth-700 hover:bg-earth-200"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Subcategory pills */}
      {subcategories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedSubcategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              !selectedSubcategory
                ? "bg-earth-700 text-white"
                : "bg-earth-50 text-earth-600 hover:bg-earth-100 border border-earth-200"
            )}
          >
            All {categoryName}
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub === selectedSubcategory ? null : sub)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                sub === selectedSubcategory
                  ? "bg-earth-700 text-white"
                  : "bg-earth-50 text-earth-600 hover:bg-earth-100 border border-earth-200"
              )}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      <ProductGrid products={filtered} />
    </div>
  );
}
