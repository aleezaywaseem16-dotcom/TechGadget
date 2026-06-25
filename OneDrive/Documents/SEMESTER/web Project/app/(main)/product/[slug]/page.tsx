import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { StarRating } from "@/components/product/StarRating";
import { ReviewList } from "@/components/product/ReviewList";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { Package, ShieldCheck, Truck } from "lucide-react";
import type { Product, Review } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name, description").eq("slug", slug).single();
  if (!data) return { title: "Product not found" };
  return { title: data.name, description: data.description.slice(0, 155) };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(`*, category:categories(id, name, slug), brand:brands(id, name), images:product_images(url, alt, position)`)
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (!product) notFound();

  const images = ((product.images as { url: string; alt: string | null; position: number }[]) ?? [])
    .sort((a, b) => a.position - b.position);

  const primaryImage = images[0]?.url ?? "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop";

  // Load reviews and related products in parallel
  const [reviewRes, relatedRes] = await Promise.all([
    supabase
      .from("reviews")
      .select("*, profile:profiles(full_name, avatar_url)")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false })
      .limit(10),
    product.category_id
      ? supabase
          .from("products")
          .select(`*, category:categories(id, name, slug), brand:brands(id, name), images:product_images(url, alt, position)`)
          .eq("status", "active")
          .eq("category_id", product.category_id)
          .neq("id", product.id)
          .limit(4)
      : Promise.resolve({ data: [] }),
  ]);

  const reviews = (reviewRes.data ?? []) as (Review & { profile?: { full_name: string | null; avatar_url: string | null } | null })[];
  const related = (relatedRes.data ?? []) as unknown as Product[];

  const discount = calcDiscount(product.compare_at_price ?? 0, product.price);
  const inStock = product.stock_quantity > 0;
  const specs = product.specs as Record<string, string> | null;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-foreground">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop/${product.category.slug}`} className="hover:text-foreground">{product.category.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate max-w-40">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <ProductGallery images={images} productName={product.name} />

        {/* Info */}
        <div>
          {product.brand && (
            <p className="text-sm text-muted-foreground mb-2">{product.brand.name}</p>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <StarRating rating={product.rating_avg} count={product.rating_count} size="md" />
            <Separator orientation="vertical" className="h-4" />
            <span className={`text-sm font-medium ${inStock ? "text-emerald-600" : "text-rose-600"}`}>
              {inStock ? `${product.stock_quantity} in stock` : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
                <Badge className="bg-rose-500 text-white border-0">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

          {/* Add to cart */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  stock_quantity: product.stock_quantity,
                }}
                image={primaryImage}
                className="h-11 text-base"
              />
            </div>
            <WishlistButton
              productId={product.id}
              productName={product.name}
              className="w-11 h-11 border rounded-xl"
            />
          </div>

          {/* Perks */}
          <div className="space-y-3 py-5 border-t border-b">
            {[
              { icon: Truck,        label: "Free shipping on orders over $50" },
              { icon: Package,      label: "Easy 30-day returns" },
              { icon: ShieldCheck,  label: "Genuine product, 1-year warranty" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm">
                <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* SKU */}
          <p className="text-xs text-muted-foreground mt-4">SKU: {product.sku}</p>
        </div>
      </div>

      {/* Specifications */}
      {specs && Object.keys(specs).length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
          <div className="rounded-xl border overflow-hidden">
            {Object.entries(specs).map(([key, val], i) => (
              <div
                key={key}
                className={`grid grid-cols-2 gap-4 px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-muted/40" : "bg-background"}`}
              >
                <span className="font-medium text-muted-foreground">{key}</span>
                <span>{val}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            Customer Reviews{reviews.length > 0 ? ` (${reviews.length})` : ""}
          </h2>
          <div className="flex items-center gap-2">
            <StarRating rating={product.rating_avg} size="md" />
            <span className="font-semibold">{product.rating_avg.toFixed(1)}</span>
          </div>
        </div>
        <ReviewList reviews={reviews} />
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p as Product & { category?: { name: string; slug: string } | null; brand?: { name: string } | null; images?: { url: string; alt: string | null; position: number }[] }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
