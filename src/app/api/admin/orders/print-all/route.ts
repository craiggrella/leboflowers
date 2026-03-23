import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const statusFilter = req.nextUrl.searchParams.get("status") || "paid";
  const supabase = createAdminClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("status", statusFilter)
    .order("order_number", { ascending: true });

  if (!orders || orders.length === 0) {
    return new NextResponse(`<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>No ${statusFilter} orders to print.</h2></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Fetch all order items
  const orderIds = orders.map((o) => o.id);
  const { data: allItems } = await supabase
    .from("order_items")
    .select("*")
    .in("order_id", orderIds);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://leboflowers.vercel.app";
  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  // Generate all QR codes
  const qrCodes: Record<string, string> = {};
  for (const order of orders) {
    qrCodes[order.id] = await QRCode.toDataURL(`${siteUrl}/admin/fulfill?id=${order.id}`, {
      width: 150,
      margin: 1,
      color: { dark: "#166534", light: "#ffffff" },
    });
  }

  const slips = orders.map((order) => {
    const items = (allItems || []).filter((i) => i.order_id === order.id);
    const isPaid = order.status === "paid" || order.status === "fulfilled";
    const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2db;font-family:monospace;font-size:11px;color:#6b5744">${item.sku}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2db;font-size:12px">${item.product_name}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2db;text-align:right;font-size:12px">${formatMoney(item.price_cents)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2db;text-align:center;font-size:12px">${item.quantity}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #e5e2db;text-align:right;font-size:12px;font-weight:600">${formatMoney(item.price_cents * item.quantity)}</td>
        </tr>`
      )
      .join("");

    return `
    <div class="slip">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;font-weight:900;opacity:0.05;color:${isPaid ? "#16a34a" : "#e11d48"};pointer-events:none;letter-spacing:8px">${statusLabel.toUpperCase()}</div>

      <div style="position:relative;z-index:1">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #16a34a;padding-bottom:12px;margin-bottom:14px">
          <div>
            <h1 style="margin:0;font-size:24px;font-weight:900;color:#2d2418">${order.customer_name}</h1>
            <p style="margin:3px 0 0;font-size:12px;color:#6b5744">
              ${order.customer_email || ""}${order.customer_email && order.customer_phone ? " &bull; " : ""}${order.customer_phone || ""}
            </p>
            <p style="margin:4px 0 0;font-size:11px;color:#6b5744">
              <strong>Order #${order.order_number}</strong> &bull; ${new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} &bull;
              <span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;background:${isPaid ? "#dcfce7" : "#fee2e2"};color:${isPaid ? "#166534" : "#be123c"}">${statusLabel}</span>
            </p>
          </div>
          <div style="text-align:center;flex-shrink:0;margin-left:12px">
            <img src="${qrCodes[order.id]}" style="width:80px;height:80px" />
            <p style="margin:2px 0 0;font-size:7px;color:#6b5744">Scan to fulfill</p>
          </div>
        </div>

        ${order.organization ? `
        <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:8px;padding:10px;margin-bottom:12px;text-align:center">
          <p style="margin:0;font-size:10px;color:#6b5744;text-transform:uppercase;letter-spacing:1px">Supporting</p>
          <p style="margin:2px 0 0;font-size:14px;font-weight:700;color:#166534">${order.organization}</p>
        </div>` : ""}

        <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
          <thead>
            <tr style="background:#166534;color:white">
              <th style="padding:6px 8px;text-align:left;font-size:10px;font-weight:600">SKU</th>
              <th style="padding:6px 8px;text-align:left;font-size:10px;font-weight:600">Product</th>
              <th style="padding:6px 8px;text-align:right;font-size:10px;font-weight:600">Price</th>
              <th style="padding:6px 8px;text-align:center;font-size:10px;font-weight:600">Qty</th>
              <th style="padding:6px 8px;text-align:right;font-size:10px;font-weight:600">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;border-top:2px solid #166534;padding-top:8px">
          <span style="font-size:16px;font-weight:800;color:#166534">Total: ${formatMoney(order.subtotal_cents)}</span>
        </div>

        <div style="margin-top:16px;display:flex;gap:30px;font-size:11px;color:#6b5744">
          <span>Pulled by: _____________________</span>
          <span>Verified by: _____________________</span>
        </div>
      </div>
    </div>`;
  });

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>All Order Slips - Mt. Lebanon Flower Sale</title>
  <style>
    @media print {
      .no-print { display: none !important; }
    }
    @page { margin: 0.5in; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #2d2418;
      margin: 0;
      padding: 0;
    }
    .slip {
      position: relative;
      overflow: hidden;
      padding: 30px;
      page-break-after: always;
      min-height: calc(100vh - 1in);
      box-sizing: border-box;
    }
    .slip:last-child {
      page-break-after: auto;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;padding:20px;background:#166534;color:white;position:sticky;top:0;z-index:10">
    <strong>Printing ${orders.length} order slips</strong> &mdash;
    <button onclick="window.print()" style="background:white;color:#166534;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;margin-left:8px">Print All</button>
  </div>
  ${slips.join("")}
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
