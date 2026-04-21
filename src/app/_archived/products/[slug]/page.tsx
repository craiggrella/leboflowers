import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductDetailClient from "@/components/ProductDetailClient";
import type { Product, Category } from "@/types";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Mt. Lebanon Flower Sale`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (!product) notFound();

  const { data: categories } = await supabase.from("categories").select("*");
  const category = (categories as Category[])?.find((c) => c.id === (product as Product).category_id);

  return <ProductDetailClient product={product as Product} categoryName={category?.name ?? ""} />;
}
