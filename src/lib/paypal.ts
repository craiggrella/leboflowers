const PAYPAL_API = process.env.PAYPAL_MODE === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function createPayPalOrder(totalDollars: string, items: { name: string; quantity: number; unit_amount: string }[]) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalDollars,
            breakdown: {
              item_total: { currency_code: "USD", value: totalDollars },
            },
          },
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity.toString(),
            unit_amount: { currency_code: "USD", value: item.unit_amount },
          })),
        },
      ],
    }),
  });

  const data = await res.json();
  return data;
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
}
