import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { items, customerName, customerEmail, customerPhone } = await req.json();

    if (!items?.length || !customerName || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Validate prices against DB
    const productIds = items.map((i: { productId: string }) => i.productId);
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id, sku, name, price_cents, unit_label")
      .in("id", productIds);

    if (!dbProducts) {
      return NextResponse.json({ error: "Failed to verify products" }, { status: 500 });
    }

    let totalCents = 0;
    const paypalItems = items.map(
      (item: { productId: string; sku: string; quantity: number }) => {
        const product = dbProducts.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        totalCents += product.price_cents * item.quantity;
        return {
          name: `${product.sku} - ${product.name}`,
          quantity: item.quantity,
          unit_amount: (product.price_cents / 100).toFixed(2),
        };
      }
    );

    const totalDollars = (totalCents / 100).toFixed(2);

    const order = await createPayPalOrder(totalDollars, paypalItems);

    if (!order.id) {
      console.error("PayPal order creation failed:", order);
      return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
    }

    // Store metadata for capture step
    // We pass it back to the client which sends it on capture
    return NextResponse.json({
      orderID: order.id,
      metadata: { customerName, customerEmail, customerPhone, items },
    });
  } catch (error) {
    console.error("PayPal create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
