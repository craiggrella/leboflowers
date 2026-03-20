"use client";

import { useEffect, useState } from "react";
import { formatCurrency, slugify } from "@/lib/utils";
import { Pencil, X, Save } from "lucide-react";
import type { Product, Category } from "@/types";

interface EditForm {
  sku: string;
  name: string;
  description: string;
  price_dollars: string;
  unit_label: string;
  category_id: string;
  subcategory: string;
  in_stock: boolean;
  image_url: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setLoading(false);
      });
  }, []);

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description || "",
      price_dollars: (product.price_cents / 100).toFixed(2),
      unit_label: product.unit_label,
      category_id: product.category_id,
      subcategory: product.subcategory || "",
      in_stock: product.in_stock,
      image_url: product.image_url || "",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setForm(null);
  };

  const handleSave = async () => {
    if (!form || !editingId) return;
    setSaving(true);

    const priceCents = Math.round(parseFloat(form.price_dollars) * 100);
    const slug = slugify(`${form.sku}-${form.name}`);

    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingId,
        sku: form.sku,
        name: form.name,
        slug,
        description: form.description || null,
        price_cents: priceCents,
        unit_label: form.unit_label,
        category_id: form.category_id,
        subcategory: form.subcategory || null,
        in_stock: form.in_stock,
        image_url: form.image_url || null,
      }),
    });
    const result = await res.json();

    if (result.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, sku: form.sku, name: form.name, slug, description: form.description || null, price_cents: priceCents, unit_label: form.unit_label, category_id: form.category_id, subcategory: form.subcategory || null, in_stock: form.in_stock, image_url: form.image_url || null }
            : p
        )
      );
      closeEdit();
    }
    setSaving(false);
  };

  const toggleStock = async (productId: string, currentlyInStock: boolean) => {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, in_stock: !currentlyInStock }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, in_stock: !currentlyInStock } : p))
    );
  };

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900">Products</h1>
        <span className="text-sm text-earth-500">{products.length} total products</span>
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
              <th className="text-left px-4 py-3 font-medium text-earth-600">Subcategory</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Unit</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">In Stock</th>
              <th className="text-left px-4 py-3 font-medium text-earth-600">Edit</th>
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
                  <td className="px-4 py-3 text-earth-500 text-xs">{product.subcategory || "—"}</td>
                  <td className="px-4 py-3">{formatCurrency(product.price_cents)}</td>
                  <td className="px-4 py-3 text-earth-500">{product.unit_label}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStock(product.id, product.in_stock)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                        product.in_stock ? "bg-garden-100 text-garden-700" : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {product.in_stock ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(product)}
                      className="text-earth-400 hover:text-garden-600 transition-colors"
                      title="Edit product"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-8 text-earth-500 text-sm">Loading products...</div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeEdit}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-earth-100">
              <h2 className="font-display text-lg font-bold text-earth-900">Edit Product</h2>
              <button onClick={closeEdit} className="text-earth-400 hover:text-earth-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price_dollars}
                    onChange={(e) => setForm({ ...form, price_dollars: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Unit Label</label>
                  <input
                    type="text"
                    value={form.unit_label}
                    onChange={(e) => setForm({ ...form, unit_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-1">Category</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Subcategory</label>
                <input
                  type="text"
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                  placeholder="e.g. Begonia Flat, Specialty HB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-earth-200 text-sm focus:ring-2 focus:ring-garden-400 focus:border-transparent"
                />
                {form.image_url && (
                  <img src={form.image_url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-lg border border-earth-200" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={form.in_stock}
                  onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                  className="rounded border-earth-300"
                />
                <label htmlFor="in_stock" className="text-sm text-earth-700">In Stock</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-earth-100">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-lg text-sm font-medium text-earth-600 hover:bg-earth-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-garden-600 text-white hover:bg-garden-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
