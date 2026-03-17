import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getCategories } from "@/lib/data";
import ProductDetailClient from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | Mt. Lebanon Flower Sale`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const categories = getCategories();
  const category = categories.find((c) => c.id === product.category_id);

  return <ProductDetailClient product={product} categoryName={category?.name ?? ""} />;
}
