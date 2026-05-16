import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import { formatPhone } from "@/lib/utils";

// Single-sheet summary of every order not yet picked up, generated fresh on
// each request. "Unfulfilled" = status pending or paid (excludes fulfilled
// and cancelled). Used by volunteers as a checklist during pickup day.

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  const { data: rawOrders } = await supabase
    .from("orders")
    .select("order_number, customer_name, customer_phone, subtotal_cents, status")
    .in("status", ["pending", "paid"]);

  // Sort by customer name so a volunteer can find a person quickly.
  const orders = (rawOrders || []).sort((a, b) =>
    (a.customer_name || "").toLowerCase().localeCompare((b.customer_name || "").toLowerCase())
  );

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const printedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  if (orders.length === 0) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>No unfulfilled orders.</h2><p style="color:#6b5744">Every paid order has been picked up. (${printedAt})</p></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  const total = orders.reduce((sum, o) => sum + o.subtotal_cents, 0);

  const rows = orders
    .map((o) => {
      const isPending = o.status === "pending";
      return `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e2db;font-family:monospace;font-size:13px;color:#6b5744">#${o.order_number}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e2db;font-size:14px;font-weight:600">${o.customer_name || "—"}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e2db;font-size:13px;font-family:monospace">${o.customer_phone ? formatPhone(o.customer_phone) : "—"}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e2db;text-align:right;font-size:14px;font-weight:600">${formatMoney(o.subtotal_cents)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e2db;text-align:center">
          <span style="display:inline-block;padding:1px 8px;border-radius:10px;font-size:10px;font-weight:700;background:${isPending ? "#fee2e2" : "#dcfce7"};color:${isPending ? "#be123c" : "#166534"}">${isPending ? "UNPAID" : "Paid"}</span>
        </td>
      </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Unfulfilled Orders - Mt. Lebanon Flower Sale</title>
  <style>
    @media print { .no-print { display: none !important; } }
    @page { margin: 0.5in; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #2d2418;
      margin: 0;
      padding: 30px;
    }
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align:center;padding:14px;background:#166534;color:white;border-radius:8px;margin-bottom:20px">
    <strong>${orders.length} unfulfilled order${orders.length === 1 ? "" : "s"}</strong>
    <button onclick="window.print()" style="background:white;color:#166534;border:none;padding:8px 20px;border-radius:6px;font-weight:700;cursor:pointer;margin-left:12px">Print</button>
  </div>

  <div style="border-bottom:3px solid #16a34a;padding-bottom:12px;margin-bottom:16px">
    <h1 style="margin:0;font-size:22px;font-weight:900;color:#2d2418">Unfulfilled Orders</h1>
    <p style="margin:4px 0 0;font-size:12px;color:#6b5744">
      Printed ${printedAt} &bull; ${orders.length} order${orders.length === 1 ? "" : "s"} awaiting pickup
    </p>
  </div>

  <table>
    <thead>
      <tr style="background:#166534;color:white">
        <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:600">Order #</th>
        <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:600">Customer</th>
        <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:600">Phone</th>
        <th style="padding:8px 10px;text-align:right;font-size:11px;font-weight:600">Amount</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;font-weight:600">Status</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding:10px;text-align:right;font-size:13px;font-weight:700;border-top:2px solid #166534">Total</td>
        <td style="padding:10px;text-align:right;font-size:14px;font-weight:800;color:#166534;border-top:2px solid #166534">${formatMoney(total)}</td>
        <td style="border-top:2px solid #166534"></td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
