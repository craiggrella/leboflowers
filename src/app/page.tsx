import { createClient } from "@/lib/supabase/server";
import CatalogPage from "@/components/CatalogPage";
import type { Product, Category } from "@/types";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient();

  const [prodsRes, catsRes] = await Promise.all([
    supabase.from("products").select("*").order("category_id").order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const products = (prodsRes.data as Product[]) || [];
  const categories = (catsRes.data as Category[]) || [];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-garden-600 via-garden-500 to-garden-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1600')] bg-cover bg-center opacity-20" />
        <div className="relative container py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-sunshine-400 rounded-full animate-pulse" />
            Community Fundraiser
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Mt. Lebanon<br />Flower Sale
          </h1>
          <p className="text-lg md:text-xl text-garden-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Beautiful flowers from Dean&apos;s Greenhouse supporting Mt Lebanon
            nonprofit organizations. Every purchase makes our community bloom!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#shop"
              className="bg-white text-garden-700 font-semibold px-8 py-3 rounded-full hover:bg-garden-50 transition-colors shadow-lg"
            >
              Shop Now
            </a>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="var(--color-background)" />
          </svg>
        </div>
      </section>

      {/* About snippet */}
      <section className="container py-12">
        <div className="bg-sunshine-50 border border-sunshine-200 rounded-2xl p-6 md:p-8 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-earth-900 mb-3">
            Growing Something Beautiful Together
          </h2>
          <p className="text-earth-700 leading-relaxed">
            Proceeds stay in Mt Lebanon and support community organizations.
            All plants are provided by <strong>Dean&apos;s Greenhouse</strong> — a trusted local grower.
            Thank you for helping our neighborhood bloom!
          </p>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="shop" className="container pb-16">
        <CatalogPage products={products} categories={categories} />
      </section>
    </>
  );
}
