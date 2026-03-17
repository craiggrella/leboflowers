import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { products } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const { customerName, items } = await req.json();

    if (!customerName || !items?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Calculate total from verified prices
    let totalCents = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      totalCents += product.price_cents * item.quantity;
    }

    const paymentIntent = await getStripe().paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      metadata: {
        customerName,
        source: "in_person",
        items: JSON.stringify(items.map((i: { sku: string; quantity: number }) => ({ sku: i.sku, qty: i.quantity }))),
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("POS charge error:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
