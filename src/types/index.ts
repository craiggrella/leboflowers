export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  category_id: string;
  image_url: string | null;
  unit_label: string;
  in_stock: boolean;
  sort_order: number;
  created_at: string;
  category?: Category;
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl: string | null;
  unitLabel: string;
}

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";
export type PaymentMethod = "online_card" | "in_person_card" | "cash" | "check";
export type OrderSource = "online" | "in_person";

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: OrderStatus;
  subtotal_cents: number;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  payment_method: PaymentMethod;
  source: OrderSource;
  check_number: string | null;
  notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  sku: string;
  product_name: string;
  price_cents: number;
  quantity: number;
}
