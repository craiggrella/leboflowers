import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createAdminClient();

    // Fetch all data
    const [orderItemsRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
      supabase.from("order_items").select("*"),
      supabase.from("orders").select("*").in("status", ["paid", "fulfilled"]).order("order_number"),
      supabase.from("products").select("*").order("category_id").order("sort_order"),
      supabase.from("categories").select("*"),
    ]);

    const orders = ordersRes.data || [];
    const allItems = orderItemsRes.data || [];
    const dbProducts = productsRes.data || [];
    const dbCategories = categoriesRes.data || [];
    const paidOrderIds = new Set(orders.map((o) => o.id));
    const paidItems = allItems.filter((i) => paidOrderIds.has(i.order_id));

    // Aggregate SKU totals
    const skuTotals: Record<string, number> = {};
    for (const item of paidItems) {
      skuTotals[item.sku] = (skuTotals[item.sku] || 0) + item.quantity;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Mt. Lebanon Flower Sale";

    const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

    // Helper to style header row
    const styleHeader = (sheet: ExcelJS.Worksheet) => {
      sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      sheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF166534" },
      };
    };

    // ===== Sheet 1: Dean's Order (SKU summary) =====
    const deansSheet = workbook.addWorksheet("Dean's Order");
    deansSheet.columns = [
      { header: "SKU", key: "sku", width: 12 },
      { header: "Product Name", key: "name", width: 40 },
      { header: "Category", key: "category", width: 25 },
      { header: "Unit", key: "unit", width: 15 },
      { header: "Price", key: "price", width: 12 },
      { header: "Qty Ordered", key: "quantity", width: 15 },
      { header: "Line Total", key: "total", width: 15 },
    ];
    styleHeader(deansSheet);

    let grandTotal = 0;
    for (const product of dbProducts) {
      const qty = skuTotals[product.sku] || 0;
      const lineTotal = qty * product.price_cents / 100;
      grandTotal += lineTotal;
      const cat = dbCategories.find((c: { id: string; name: string }) => c.id === product.category_id);
      deansSheet.addRow({
        sku: product.sku,
        name: product.name,
        category: cat?.name || "",
        unit: product.unit_label,
        price: formatMoney(product.price_cents),
        quantity: qty,
        total: formatMoney(lineTotal * 100),
      });
    }
    const totalRow = deansSheet.addRow({ sku: "", name: "", category: "", unit: "", price: "", quantity: "GRAND TOTAL", total: formatMoney(grandTotal * 100) });
    totalRow.font = { bold: true };

    // ===== Sheets per Organization =====
    const ordersByOrg: Record<string, typeof orders> = {};
    for (const order of orders) {
      const orgName = order.organization || "No Organization";
      if (!ordersByOrg[orgName]) ordersByOrg[orgName] = [];
      ordersByOrg[orgName].push(order);
    }

    for (const [orgName, orgOrders] of Object.entries(ordersByOrg).sort(([a], [b]) => a.localeCompare(b))) {
      // Sheet name max 31 chars, no special chars
      const sheetName = orgName.replace(/[*?/\\[\]]/g, "").slice(0, 31);
      const orgSheet = workbook.addWorksheet(sheetName);

      orgSheet.columns = [
        { header: "Order #", key: "order_number", width: 10 },
        { header: "Customer", key: "customer", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 16 },
        { header: "SKU", key: "sku", width: 10 },
        { header: "Product", key: "product", width: 35 },
        { header: "Qty", key: "qty", width: 8 },
        { header: "Price", key: "price", width: 12 },
        { header: "Subtotal", key: "subtotal", width: 12 },
        { header: "Order Total", key: "order_total", width: 14 },
        { header: "Date", key: "date", width: 14 },
      ];
      styleHeader(orgSheet);

      let orgTotal = 0;
      for (const order of orgOrders) {
        const items = allItems.filter((i) => i.order_id === order.id);
        const isFirstItem = true;
        let firstRow = true;

        for (const item of items) {
          orgSheet.addRow({
            order_number: firstRow ? order.order_number : "",
            customer: firstRow ? order.customer_name : "",
            email: firstRow ? order.customer_email : "",
            phone: firstRow ? order.customer_phone : "",
            sku: item.sku,
            product: item.product_name,
            qty: item.quantity,
            price: formatMoney(item.price_cents),
            subtotal: formatMoney(item.price_cents * item.quantity),
            order_total: firstRow ? formatMoney(order.subtotal_cents) : "",
            date: firstRow ? new Date(order.created_at).toLocaleDateString() : "",
          });
          firstRow = false;
        }

        // If order has no items, still show the order row
        if (items.length === 0) {
          orgSheet.addRow({
            order_number: order.order_number,
            customer: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            sku: "",
            product: "(no items)",
            qty: "",
            price: "",
            subtotal: "",
            order_total: formatMoney(order.subtotal_cents),
            date: new Date(order.created_at).toLocaleDateString(),
          });
        }

        orgTotal += order.subtotal_cents;

        // Add separator row
        orgSheet.addRow({});
      }

      // Org total
      const orgTotalRow = orgSheet.addRow({
        order_number: "", customer: "", email: "", phone: "", sku: "", product: "",
        qty: "", price: "", subtotal: `${orgOrders.length} orders`,
        order_total: formatMoney(orgTotal), date: "",
      });
      orgTotalRow.font = { bold: true };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="deans-greenhouse-order-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
