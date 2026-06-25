import { ProductGridSkeleton } from "@/components/product/ProductCardSkeleton";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-6">
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
          ))}
          <div className="h-px bg-muted" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-muted rounded animate-pulse" style={{ width: `${50 + i * 6}%` }} />
          ))}
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
            <div className="h-9 bg-muted rounded-lg w-36 animate-pulse" />
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
