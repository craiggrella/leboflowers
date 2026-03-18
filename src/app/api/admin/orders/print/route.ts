import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/admin-auth";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orderId = req.nextUrl.searchParams.get("id");
  if (!orderId) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const [orderRes, itemsRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("order_items").select("*").eq("order_id", orderId),
  ]);

  const order = orderRes.data;
  const items = itemsRes.data || [];

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Generate QR code
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://leboflowers.vercel.app";
  const fulfillUrl = `${siteUrl}/admin/fulfill?id=${orderId}`;
  const qrCodeDataUrl = await QRCode.toDataURL(fulfillUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#166534", light: "#ffffff" },
  });

  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const isPaid = order.status === "paid" || order.status === "fulfilled";
  const statusLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e2db; font-family: monospace; font-size: 12px; color: #6b5744;">${item.sku}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e2db;">${item.product_name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e2db; text-align: right;">${formatMoney(item.price_cents)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e2db; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e2db; text-align: right; font-weight: 600;">${formatMoney(item.price_cents * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order #${order.order_number} - Mt. Lebanon Flower Sale</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #2d2418;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 30px;
      position: relative;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 120px;
      font-weight: 900;
      opacity: 0.06;
      color: ${isPaid ? "#16a34a" : "#e11d48"};
      pointer-events: none;
      z-index: 0;
      letter-spacing: 10px;
    }
    .content { position: relative; z-index: 1; }
  </style>
</head>
<body>
  <div class="watermark">${statusLabel.toUpperCase()}</div>
  <div class="content">
    <div class="no-print" style="text-align: center; margin-bottom: 24px;">
      <button onclick="window.print()" style="background: #16a34a; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">
        Print Order Slip
      </button>
      <button onclick="window.close()" style="background: #f0ebe3; color: #4a3c2e; border: none; padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin-left: 8px;">
        Close
      </button>
    </div>

    <!-- Header with QR -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 3px solid #16a34a; padding-bottom: 20px;">
      <div>
        <h1 style="margin: 0; font-size: 28px; color: #166534;">Mt. Lebanon Flower Sale</h1>
        <p style="margin: 4px 0 0; color: #6b5744; font-size: 13px;">Community Fundraiser &bull; Dean's Greenhouse</p>
      </div>
      <div style="text-align: center;">
        <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 120px; height: 120px;" />
        <p style="margin: 4px 0 0; font-size: 9px; color: #6b5744;">Scan to fulfill</p>
      </div>
    </div>

    <!-- Order Info -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
      <div>
        <h2 style="margin: 0 0 8px; font-size: 20px;">Order #${order.order_number}</h2>
        <p style="margin: 2px 0; font-size: 14px; color: #6b5744;">
          <strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <p style="margin: 2px 0; font-size: 14px; color: #6b5744;">
          <strong>Payment:</strong> ${order.payment_method.replace(/_/g, " ")}${order.check_number ? ` #${order.check_number}` : ""}
        </p>
        <p style="margin: 2px 0; font-size: 14px; color: #6b5744;">
          <strong>Source:</strong> ${order.source.replace(/_/g, " ")}
        </p>
      </div>
      <div style="text-align: right;">
        <div style="display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; background: ${isPaid ? "#dcfce7" : "#fee2e2"}; color: ${isPaid ? "#166534" : "#be123c"};">
          ${statusLabel}
        </div>
      </div>
    </div>

    <!-- Customer -->
    <div style="background: #faf8f5; border: 1px solid #e2d5c5; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 8px; font-size: 14px; color: #6b5744; text-transform: uppercase; letter-spacing: 1px;">Customer</h3>
      <p style="margin: 2px 0; font-size: 16px; font-weight: 600;">${order.customer_name}</p>
      ${order.customer_email ? `<p style="margin: 2px 0; font-size: 14px; color: #6b5744;">${order.customer_email}</p>` : ""}
      ${order.customer_phone ? `<p style="margin: 2px 0; font-size: 14px; color: #6b5744;">${order.customer_phone}</p>` : ""}
    </div>

    <!-- Items -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background: #166534; color: white;">
          <th style="padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600;">SKU</th>
          <th style="padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600;">Product</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 600;">Price</th>
          <th style="padding: 10px 12px; text-align: center; font-size: 12px; font-weight: 600;">Qty</th>
          <th style="padding: 10px 12px; text-align: right; font-size: 12px; font-weight: 600;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <!-- Total -->
    <div style="text-align: right; border-top: 2px solid #166534; padding-top: 12px;">
      <span style="font-size: 20px; font-weight: 800; color: #166534;">Total: ${formatMoney(order.subtotal_cents)}</span>
    </div>

    ${order.notes ? `
    <div style="margin-top: 20px; background: #fef9c3; border: 1px solid #fef08a; border-radius: 10px; padding: 12px 16px;">
      <strong style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b5744;">Notes</strong>
      <p style="margin: 4px 0 0; font-size: 14px;">${order.notes}</p>
    </div>` : ""}

    <!-- Footer -->
    <div style="text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2d5c5; color: #6b5744; font-size: 12px;">
      <p>Thank you for supporting our community! All proceeds benefit our local church and swimming club.</p>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
