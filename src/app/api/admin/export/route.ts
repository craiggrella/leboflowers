import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { createAdminClient } from "@/lib/supabase/admin";
import { products, categories } from "@/lib/data";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch all paid/fulfilled order items
    const { data: orderItems, error } = await supabase
      .from("order_items")
      .select("sku, quantity, orders!inner(status)")
      .in("orders.status", ["paid", "fulfilled"]);

    // Aggregate quantities by SKU
    const skuTotals: Record<string, number> = {};

    if (!error && orderItems) {
      for (const item of orderItems) {
        skuTotals[item.sku] = (skuTotals[item.sku] || 0) + item.quantity;
      }
    }

    // Build Excel workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Mt. Lebanon Flower Sale";

    const sheet = workbook.addWorksheet("Dean's Order");

    sheet.columns = [
      { header: "SKU", key: "sku", width: 12 },
      { header: "Product Name", key: "name", width: 40 },
      { header: "Category", key: "category", width: 25 },
      { header: "Unit", key: "unit", width: 15 },
      { header: "Price", key: "price", width: 12 },
      { header: "Qty Ordered", key: "quantity", width: 15 },
      { header: "Line Total", key: "total", width: 15 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF22C55E" },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

    // Add all products (even zero-quantity ones for completeness)
    let grandTotal = 0;
    for (const product of products) {
      const qty = skuTotals[product.sku] || 0;
      const lineTotal = qty * product.price_cents / 100;
      grandTotal += lineTotal;
      const cat = categories.find((c) => c.id === product.category_id);

      sheet.addRow({
        sku: product.sku,
        name: product.name,
        category: cat?.name || "",
        unit: product.unit_label,
        price: `$${(product.price_cents / 100).toFixed(2)}`,
        quantity: qty,
        total: `$${lineTotal.toFixed(2)}`,
      });
    }

    // Grand total row
    const totalRow = sheet.addRow({
      sku: "",
      name: "",
      category: "",
      unit: "",
      price: "",
      quantity: "GRAND TOTAL",
      total: `$${grandTotal.toFixed(2)}`,
    });
    totalRow.font = { bold: true };

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
