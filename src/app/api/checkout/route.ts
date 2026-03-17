import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customerName, customerEmail, customerPhone } = body;

    if (!items?.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate prices against our data (prevent tampering)
    const lineItems = items.map(
      (item: { productId: string; sku: string; name: string; priceCents: number; quantity: number }) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (product.price_cents !== item.priceCents) {
          throw new Error(`Price mismatch for ${product.sku}`);
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${product.sku} - ${product.name}`,
              description: product.unit_label,
            },
            unit_amount: product.price_cents,
          },
          quantity: item.quantity,
        };
      }
    );

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: customerEmail,
      metadata: {
        customerName,
        customerPhone: customerPhone || "",
        items: JSON.stringify(
          items.map((i: { sku: string; quantity: number }) => ({
            sku: i.sku,
            qty: i.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
