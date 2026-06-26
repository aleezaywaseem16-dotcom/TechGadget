import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const name = category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${name} | TechGadget` };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug } = await params;
  const { sort } = await searchParams;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  let productsQuery = supabase
    .from("products")
    .select(`*, category:categories(id, name, slug), brand:brands(id, name), images:product_images(url, alt, position)`)
    .eq("status", "active")
    .eq("category_id", category.id);

  switch (sort) {
    case "price-asc":
      productsQuery = productsQuery.order("price", { ascending: true });
      break;
    case "price-desc":
      productsQuery = productsQuery.order("price", { ascending: false });
      break;
    case "rating":
      productsQuery = productsQuery.order("rating_avg", { ascending: false });
      break;
    default:
      productsQuery = productsQuery.order("created_at", { ascending: false });
  }

  const { data: products } = await productsQuery;
  const activeSort = sort ?? "newest";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1.5 max-w-xl">{category.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">{products?.length ?? 0} products</p>
        </div>

        {/* Sort pills */}
        <div className="flex gap-1.5 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <Link
              key={opt.value}
              href={`/shop/${slug}?sort=${opt.value}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeSort === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-accent"
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {!products?.length ? (
        <div className="text-center py-24 text-muted-foreground">
          <p className="mb-4">No products in this category yet.</p>
          <Button asChild variant="outline">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products as unknown as Product[]).map((p) => (
            <ProductCard
              key={p.id}
              product={
                p as Product & {
                  category?: { name: string; slug: string } | null;
                  brand?: { name: string } | null;
                  images?: { url: string; alt: string | null; position: number }[];
                }
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
