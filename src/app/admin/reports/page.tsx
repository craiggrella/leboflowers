"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface ReportsData {
  totalOrders: number;
  totalRevenue: number;
  paymentBreakdown: { method: string; count: number; total: number }[];
  topProducts: { sku: string; name: string; quantity: number; revenue: number }[];
  categorySales: { name: string; total: number; count: number }[];
  organizationBreakdown: { name: string; count: number; total: number }[];
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Sales Reports</h1>
        <p className="text-earth-500">Loading reports...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-6">Sales Reports</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <span className="text-sm text-earth-500">Total Revenue (Paid/Fulfilled)</span>
          <div className="text-2xl font-bold text-garden-700 mt-1">{formatCurrency(data.totalRevenue)}</div>
        </div>
        <div className="bg-white rounded-xl border border-earth-100 p-5 shadow-sm">
          <span className="text-sm text-earth-500">Completed Orders</span>
          <div className="text-2xl font-bold text-earth-900 mt-1">{data.totalOrders}</div>
        </div>
      </div>

      {/* Organization Breakdown */}
      <div className="bg-white rounded-xl border border-garden-200 p-6 shadow-sm mb-8">
        <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Revenue by Organization</h2>
        {data.organizationBreakdown.length === 0 ? (
          <p className="text-earth-500 text-sm">No sales data yet.</p>
        ) : (
          <div className="space-y-4">
            {data.organizationBreakdown.map((org) => (
              <div key={org.name} className="flex justify-between items-center">
                <div>
                  <span className="text-earth-900 font-medium">{org.name}</span>
                  <span className="text-earth-400 ml-2 text-sm">({org.count} orders)</span>
                </div>
                <span className="text-lg font-bold text-garden-700">{formatCurrency(org.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Revenue by Category</h2>
          {data.categorySales.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.categorySales.map((cat) => (
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

        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Top 10 Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topProducts.map((prod, i) => (
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

        <div className="bg-white rounded-xl border border-earth-100 p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-earth-900 mb-4">Payment Methods</h2>
          {data.paymentBreakdown.length === 0 ? (
            <p className="text-earth-500 text-sm">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.paymentBreakdown.map((pm) => (
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
