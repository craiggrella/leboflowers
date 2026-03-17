"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all",
          !selected
            ? "bg-garden-600 text-white shadow-sm"
            : "bg-earth-100 text-earth-700 hover:bg-earth-200"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            cat.slug === selected
              ? "bg-garden-600 text-white shadow-sm"
              : "bg-earth-100 text-earth-700 hover:bg-earth-200"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
