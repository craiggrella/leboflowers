import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

interface OrderReceiptData {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  items: { sku: string; name: string; priceCents: number; quantity: number }[];
  totalCents: number;
  paymentMethod: string;
  createdAt: string;
}

export async function sendOrderReceipt(data: OrderReceiptData) {
  const transport = getTransport();
  if (!transport) {
    console.log("SMTP not configured — skipping receipt email");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
  const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const itemRows = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e2db;font-family:monospace;font-size:13px;color:#6b5744">${item.sku}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e2db;font-size:14px;color:#2d2418">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e2db;text-align:center;font-size:14px;color:#2d2418">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e2db;text-align:right;font-size:14px;color:#2d2418">${formatMoney(item.priceCents)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e2db;text-align:right;font-size:14px;font-weight:600;color:#2d2418">${formatMoney(item.priceCents * item.quantity)}</td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:20px">

    <!-- Header -->
    <div style="background:#166534;border-radius:12px 12px 0 0;padding:30px;text-align:center">
      <h1 style="margin:0;color:white;font-size:24px">Mt. Lebanon Flower Sale</h1>
      <p style="margin:6px 0 0;color:#bbf7d0;font-size:13px">Community Fundraiser &bull; Dean's Greenhouse</p>
    </div>

    <!-- Body -->
    <div style="background:white;padding:30px;border:1px solid #e2d5c5;border-top:none">

      <h2 style="margin:0 0 4px;color:#166534;font-size:20px">Order Confirmed!</h2>
      <p style="margin:0 0 20px;color:#6b5744;font-size:14px">Thank you for your order, ${data.customerName}!</p>

      <!-- Order info -->
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:20px">
        <table style="width:100%;font-size:14px;color:#2d2418">
          <tr>
            <td style="padding:2px 0"><strong>Order #</strong></td>
            <td style="padding:2px 0;text-align:right">${data.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding:2px 0"><strong>Date</strong></td>
            <td style="padding:2px 0;text-align:right">${new Date(data.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</td>
          </tr>
          <tr>
            <td style="padding:2px 0"><strong>Payment</strong></td>
            <td style="padding:2px 0;text-align:right;text-transform:capitalize">${data.paymentMethod.replace(/_/g, " ")}</td>
          </tr>
        </table>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <thead>
          <tr style="background:#166534">
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:white">SKU</th>
            <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:white">Product</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:white">Qty</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:white">Price</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:white">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <!-- Total -->
      <div style="text-align:right;border-top:2px solid #166534;padding-top:12px;margin-bottom:24px">
        <span style="font-size:22px;font-weight:800;color:#166534">Total: ${formatMoney(data.totalCents)}</span>
      </div>

      <!-- Pickup info -->
      <div style="background:#fef9c3;border:1px solid #fef08a;border-radius:8px;padding:14px;margin-bottom:20px">
        <strong style="font-size:13px;color:#6b5744">Pickup Information</strong>
        <p style="margin:6px 0 0;font-size:14px;color:#2d2418">
          You will receive a separate notification with pickup date, time, and location details.
          Please bring this email or your order number for pickup.
        </p>
      </div>

      <p style="font-size:14px;color:#6b5744;line-height:1.6">
        Thank you for supporting our community! 100% of proceeds benefit our local church and swimming club.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#faf8f5;border:1px solid #e2d5c5;border-top:none;border-radius:0 0 12px 12px;padding:16px;text-align:center">
      <p style="margin:0;font-size:12px;color:#6b5744">
        Mt. Lebanon Flower Sale &bull; All flowers by Dean's Greenhouse
      </p>
    </div>

  </div>
</body>
</html>`;

  try {
    await transport.sendMail({
      from,
      to: data.customerEmail,
      subject: `Order #${data.orderNumber} Confirmed — Mt. Lebanon Flower Sale`,
      html,
    });
    console.log(`Receipt email sent to ${data.customerEmail} for order #${data.orderNumber}`);
  } catch (err) {
    console.error("Failed to send receipt email:", err);
  }
}
