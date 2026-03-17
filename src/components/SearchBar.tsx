"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
      <input
        type="text"
        placeholder="Search flowers, herbs, baskets..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 rounded-full border border-earth-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-garden-400 focus:border-transparent placeholder:text-earth-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
