"use client";

import Link from "next/link";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store/ui-store";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/product/WishlistButton";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { StarRating } from "@/components/product/StarRating";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

// Inline product shape that can come from Supabase
interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  rating_avg: number;
  rating_count: number;
  image: string;
  brand?: string;
}

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details for wishlisted IDs from the API
  useEffect(() => {
    const ids = Array.from(productIds);
    if (!ids.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?ids=${ids.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
        }
      } catch {
        // API may not exist yet — show empty state gracefully
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [productIds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[3/4]" />
          ))}
        </div>
      </div>
    );
  }

  if (!productIds.size) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Heart className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-8">Save items you love to find them later.</p>
        <Button asChild>
          <Link href="/shop">Browse Products <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    );
  }

  // If we have IDs but API not set up yet — show the count
  if (!products.length) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">
          My Wishlist <span className="text-muted-foreground font-normal text-lg">({productIds.size} saved)</span>
        </h1>
        <div className="text-center py-24 text-muted-foreground">
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p>You have {productIds.size} saved item{productIds.size !== 1 ? "s" : ""}.</p>
          <p className="text-sm mt-2">Connect the database to see product details here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          My Wishlist <span className="text-muted-foreground font-normal text-lg">({products.length} items)</span>
        </h1>
        <Button asChild variant="outline">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
            <Link href={`/product/${p.slug}`} className="relative aspect-square bg-muted overflow-hidden block">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute top-3 right-3">
                <WishlistButton productId={p.id} productName={p.name} />
              </div>
            </Link>

            <div className="p-4 flex flex-col flex-1">
              {p.brand && <p className="text-xs text-muted-foreground mb-1">{p.brand}</p>}
              <Link href={`/product/${p.slug}`} className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors mb-2 flex-1">
                {p.name}
              </Link>
              <StarRating rating={p.rating_avg} count={p.rating_count} className="mb-3" />
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold">{formatPrice(p.price)}</span>
                {p.compare_at_price && p.compare_at_price > p.price && (
                  <span className="text-xs text-muted-foreground line-through">{formatPrice(p.compare_at_price)}</span>
                )}
              </div>
              <AddToCartButton
                product={{ id: p.id, name: p.name, slug: p.slug, price: p.price, stock_quantity: p.stock_quantity }}
                image={p.image}
                variant="icon"
                className="self-end"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
