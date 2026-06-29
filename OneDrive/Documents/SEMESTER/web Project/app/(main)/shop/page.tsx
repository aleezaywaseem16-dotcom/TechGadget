import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { Button } from "@/components/ui/button";
import type { Product, Category, Brand } from "@/types";

export const metadata: Metadata = { title: "Shop All Products" };

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const PAGE_SIZE = 12;

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    featured?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const currentPage = Math.max(1, parseInt(params.page ?? "1"));

  // Load filter data in parallel
  const [catRes, brandRes] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("brands").select("*").order("name"),
  ]);

  const categories = (catRes.data ?? []) as Category[];
  const brands = (brandRes.data ?? []) as Brand[];

  // Resolve category slug → id
  let categoryId: string | null = null;
  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    categoryId = cat?.id ?? null;
  }

  // Resolve brand slug → id
  let brandId: string | null = null;
  if (params.brand) {
    const br = brands.find((b) => b.slug === params.brand);
    brandId = br?.id ?? null;
  }

  // Build products query
  let query = supabase
    .from("products")
    .select(
      `*, category:categories(id, name, slug), brand:brands(id, name), images:product_images(url, alt, position)`,
      { count: "exact" }
    )
    .eq("status", "active");

  if (params.q) query = query.ilike("name", `%${params.q}%`);
  if (categoryId) query = query.eq("category_id", categoryId);
  if (brandId) query = query.eq("brand_id", brandId);
  if (params.minPrice) query = query.gte("price", parseFloat(params.minPrice));
  if (params.maxPrice) query = query.lte("price", parseFloat(params.maxPrice));
  if (params.featured === "true") query = query.eq("is_featured", true);

  // Sorting
  switch (params.sort) {
    case "price-asc":  query = query.order("price", { ascending: true }); break;
    case "price-desc": query = query.order("price", { ascending: false }); break;
    case "rating":     query = query.order("rating_count", { ascending: false }).order("rating_avg", { ascending: false }); break;
    default:           query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const from = (currentPage - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: products, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-3xl font-bold mb-1">
          {params.q ? `Search: "${params.q}"` : params.featured === "true" ? "Featured Deals" : "All Products"}
        </h1>
        <p className="text-muted-foreground">{count ?? 0} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Filters — desktop */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <FilterSidebar
            categories={categories}
            brands={brands}
            currentCategory={params.category}
            currentBrand={params.brand}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
          />
        </div>

        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Sort by:</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <Link
                  key={opt.value}
                  href={`/shop?${new URLSearchParams({
                    ...(params.q ? { q: params.q } : {}),
                    ...(params.category ? { category: params.category } : {}),
                    ...(params.brand ? { brand: params.brand } : {}),
                    sort: opt.value,
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    (params.sort ?? "newest") === opt.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {!products?.length ? (
            <div className="text-center py-24 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm mb-6">Try adjusting your filters or search term.</p>
              <Button asChild variant="outline">
                <Link href="/shop">Clear All Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {(products as unknown as Product[]).map((p) => (
                  <ProductCard key={p.id} product={p as Product & { category?: { name: string; slug: string } | null; brand?: { name: string } | null; images?: { url: string; alt: string | null; position: number }[] }} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/shop?${new URLSearchParams({ ...params, page: String(p) }).toString()}`}
                      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm border transition-colors ${
                        p === currentPage
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
