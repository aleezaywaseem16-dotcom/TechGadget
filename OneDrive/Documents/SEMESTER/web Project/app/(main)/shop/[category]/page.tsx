import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  return { title: category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const { data: products } = await supabase
    .from("products")
    .select(`*, category:categories(id, name, slug), brand:brands(id, name), images:product_images(url, alt, position)`)
    .eq("status", "active")
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-2">
          <Link href="/shop" className="hover:text-primary">Shop</Link> / {category.name}
        </p>
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-2 max-w-xl">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-1">{products?.length ?? 0} products</p>
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
            <ProductCard key={p.id} product={p as Product & { category?: { name: string; slug: string } | null; brand?: { name: string } | null; images?: { url: string; alt: string | null; position: number }[] }} />
          ))}
        </div>
      )}
    </div>
  );
}
