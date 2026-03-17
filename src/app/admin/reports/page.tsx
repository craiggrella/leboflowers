"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { categories as allCategories } from "@/lib/data";

interface CategorySales {
  name: string;
  total: number;
  count: number;
}

interface TopProduct {
  sku: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface PaymentBreakdown {
  method: string;
  count: number;
  total: number;
}

export default function ReportsPage() {
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState<PaymentBreakdown[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [ordersRes, itemsRes] = await Promise.all([
        supabase.from("orders").select("*").in("status", ["paid", "fulfilled"]),
        supabase.from("order_items").select("*, orders!inner(status)").in("orders.status", ["paid", "fulfilled"]),
      ]);

      const orders = ordersRes.data || [];
      const items = itemsRes.data || [];

      // Total stats
      setTotalOrders(orders.length);
      setTotalRevenue(orders.reduce((sum, o) => sum + o.subtotal_cents, 0));

      // Payment breakdown
      const payMap: Record<string, { count: number; total: number }> = {};
      for (const o of orders) {
        const m = o.payment_method || "unknown";
        if (!payMap[m]) payMap[m] = { count: 0, total: 0 };
        payMap[m].count++;
        payMap[m].total += o.subtotal_cents;
      }
      setPaymentBreakdown(
        Object.entries(payMap).map(([method, data]) => ({ method, ...data }))
      );

      // Top products by quantity
      const prodMap: Record<string, { sku: string; name: string; quantity: number; revenue: number }> = {};
      for (const item of items) {
        if (!prodMap[item.sku]) {
          prodMap[item.sku] = { sku: item.sku, name: item.product_name, quantity: 0, revenue: 0 };
        }
        prodMap[item.sku].quantity += item.quantity;
        prodMap[item.sku].revenue += item.price_cents * item.quantity;
      }
      setTopProducts(
        Object.values(prodMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10)
      );

      // Category sales
      const catMap: Record<string, { total: number; count: number }> = {};
      for (const item of items) {
        // Look up category from product's category_id
        const catId = item.product_id; // We need to join, but we have sku
        const cat = allCategories.find((c) => {
          // Find by checking sku prefix patterns
          return true; // Simplified - aggregate by sku grouping
        });
        const sku = item.sku;
        // Group by sku prefix for category approximation
        let catName = "Other";
        if (sku.startsWith("BA") && parseInt(sku.slice(2)) <= 7) catName = "Begonias";
        else if (sku.startsWith("BA") && parseInt(sku.slice(2)) <= 12) catName = "Impatiens";
        else if (sku.startsWith("BA") && parseInt(sku.slice(2)) <= 17) catName = "Marigolds";
        else if (sku.startsWith("BA") && parseInt(sku.slice(2)) <= 23) catName = "Petunias";
        else if (sku.startsWith("BA")) catName = "Other Annual Flats";
        else if (sku.startsWith("P") || sku.startsWith("T") || sku.startsWith("H")) catName = "Vegetables & Herbs";
        else if (sku.startsWith("A")) catName = "Fillers & Accents";
        else if (sku.startsWith("G")) catName = "Geraniums";
        else if (sku.startsWith("F") || sku.startsWith("HB") || sku.startsWith("W") || sku.startsWith("SB")) catName = "Hanging Baskets";
        else if (sku.startsWith("S") && !sku.startsWith("SB")) catName = "Supplies";
        else if (sku.startsWith("GC")) catName = "Gift Certificates";
        else if (["48", "49", "410", "411", "412", "413"].includes(sku)) catName = "Wave Petunias";
        else if (["415", "416", "417", "418", "419", "420"].includes(sku)) catName = "Sunpatiens";
        else if (["422", "423"].includes(sku)) catName = "Sweet Potato Vines";
        else if (["432", "433", "434"].includes(sku)) catName = "Calibrachoa & Specialty";
        else if (["425", "426", "427", "428", "429", "431"].includes(sku)) catName = "Tuberous Begonias";

        if (!catMap[catName]) catMap[catName] = { total: 0, count: 0 };
        catMap[catName].total += item.price_cents * item.quantity;
        catMap[catName].count += item.quantity;
      }
      setCategorySales(
        Object.entries(catMap)
          .map(([name, data]) => ({ name, ...data }))
          .sort((a, b) => b.total - a.total)
      );

      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Sales Reports</h1>
        <p className="text-earth-500">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Sales Reports</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <span className="text-sm text-earth-500">Total Revenue (Paid/Fulfilled)</span>
          <div className="text-2xl font-bold text-garden-700 mt-1">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <span className="text-sm text-earth-500">Completed Orders</span>
          <div className="text-2xl font-bold text-earth-900 mt-1">{totalOrders}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Revenue by Category</h2>
          {categorySales.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {categorySales.map((cat) => (
                <div key={cat.name} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-earth-900">{cat.name}</span>
                    <span className="text-earth-400 ml-2">({cat.count} items)</span>
                  </div>
                  <span className="font-medium text-garden-700">{formatCurrency(cat.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Top 10 Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((prod, i) => (
                <div key={prod.sku} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-earth-400 mr-2">{i + 1}.</span>
                    <span className="font-mono text-xs text-earth-500 mr-1">{prod.sku}</span>
                    <span className="text-earth-900">{prod.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-earth-500">{prod.quantity} sold</span>
                    <span className="ml-2 font-medium text-garden-700">{formatCurrency(prod.revenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Payment Methods</h2>
          {paymentBreakdown.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {paymentBreakdown.map((pm) => (
                <div key={pm.method} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-earth-900 capitalize">{pm.method.replace(/_/g, " ")}</span>
                    <span className="text-earth-400 ml-2">({pm.count} orders)</span>
                  </div>
                  <span className="font-medium text-garden-700">{formatCurrency(pm.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
