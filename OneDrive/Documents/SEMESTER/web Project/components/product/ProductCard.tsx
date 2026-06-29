import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import { ProductCardImage } from "./ProductCardImage";
import { formatPrice, calcDiscount } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product & {
    category?: { name: string; slug: string } | null;
    brand?: { name: string } | null;
    images?: { url: string; alt: string | null; position: number }[];
  };
}

const FALLBACK = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop";

export function ProductCard({ product }: ProductCardProps) {
  const sortedImages = product.images?.sort((a, b) => a.position - b.position) ?? [];
  const firstImage = sortedImages[0]?.url ?? FALLBACK;
  const discount = calcDiscount(product.compare_at_price ?? 0, product.price);
  const inStock = product.stock_quantity > 0;

  return (
    <div className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image area */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-muted overflow-hidden">
        <ProductCardImage
          images={sortedImages}
          productName={product.name}
          fallback={FALLBACK}
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new_arrival && (
            <Badge className="text-[10px] py-0.5 px-2 bg-sky-600 text-white border-0 shadow-sm">New</Badge>
          )}
          {discount > 0 && (
            <Badge className="text-[10px] py-0.5 px-2 bg-rose-500 text-white border-0 shadow-sm">-{discount}%</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="text-[10px] py-0.5 px-2">Out of Stock</Badge>
          )}
        </div>

        {/* Wishlist — top right */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WishlistButton productId={product.id} productName={product.name} />
        </div>

        {/* Quick Add — bottom right, hover only on desktop */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <AddToCartButton product={product} image={firstImage} variant="icon" />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <p className="text-[11px] text-muted-foreground mb-1 font-medium uppercase tracking-wide">{product.brand.name}</p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="font-medium text-sm leading-snug hover:text-primary transition-colors line-clamp-2 mb-2 flex-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mb-3">
          {product.rating_count > 0 ? (
            <StarRating rating={product.rating_avg} count={product.rating_count} />
          ) : (
            <span className="text-xs text-muted-foreground">No reviews yet</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-base">{formatPrice(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
          {/* Always-visible Add to Cart on mobile */}
          <div className="sm:hidden">
            <AddToCartButton product={product} image={firstImage} variant="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
