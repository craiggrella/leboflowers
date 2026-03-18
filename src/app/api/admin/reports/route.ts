import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const [ordersRes, itemsRes] = await Promise.all([
    supabase.from("orders").select("*").in("status", ["paid", "fulfilled"]),
    supabase.from("order_items").select("*"),
  ]);

  const orders = ordersRes.data || [];
  const allItems = itemsRes.data || [];
  const paidOrderIds = new Set(orders.map((o) => o.id));
  const items = allItems.filter((i) => paidOrderIds.has(i.order_id));

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal_cents, 0);

  const payMap: Record<string, { count: number; total: number }> = {};
  for (const o of orders) {
    const m = o.payment_method || "unknown";
    if (!payMap[m]) payMap[m] = { count: 0, total: 0 };
    payMap[m].count++;
    payMap[m].total += o.subtotal_cents;
  }

  const prodMap: Record<string, { sku: string; name: string; quantity: number; revenue: number }> = {};
  for (const item of items) {
    if (!prodMap[item.sku]) {
      prodMap[item.sku] = { sku: item.sku, name: item.product_name, quantity: 0, revenue: 0 };
    }
    prodMap[item.sku].quantity += item.quantity;
    prodMap[item.sku].revenue += item.price_cents * item.quantity;
  }

  const productIds = [...new Set(items.filter((i) => i.product_id).map((i) => i.product_id))];
  const { data: products } = await supabase
    .from("products")
    .select("id, category_id")
    .in("id", productIds.length > 0 ? productIds : ["none"]);

  const { data: categories } = await supabase.from("categories").select("id, name");

  const productCategoryMap: Record<string, string> = {};
  for (const p of products || []) {
    const cat = (categories || []).find((c) => c.id === p.category_id);
    if (cat) productCategoryMap[p.id] = cat.name;
  }

  const catMap: Record<string, { total: number; count: number }> = {};
  for (const item of items) {
    const catName = (item.product_id && productCategoryMap[item.product_id]) || "Other";
    if (!catMap[catName]) catMap[catName] = { total: 0, count: 0 };
    catMap[catName].total += item.price_cents * item.quantity;
    catMap[catName].count += item.quantity;
  }

  // Organization breakdown
  const orgMap: Record<string, { count: number; total: number }> = {};
  for (const o of orders) {
    const orgName = o.organization || "Not specified";
    if (!orgMap[orgName]) orgMap[orgName] = { count: 0, total: 0 };
    orgMap[orgName].count++;
    orgMap[orgName].total += o.subtotal_cents;
  }

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    paymentBreakdown: Object.entries(payMap).map(([method, data]) => ({ method, ...data })),
    topProducts: Object.values(prodMap).sort((a, b) => b.quantity - a.quantity).slice(0, 10),
    categorySales: Object.entries(catMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total),
    organizationBreakdown: Object.entries(orgMap).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.total - a.total),
  });
}
