"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Category, Brand } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  currentCategory?: string;
  currentBrand?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

const PRICE_RANGES = [
  { label: "Under Rs. 25,000",          min: "0",      max: "25000"  },
  { label: "Rs. 25,000 – Rs. 75,000",   min: "25000",  max: "75000"  },
  { label: "Rs. 75,000 – Rs. 200,000",  min: "75000",  max: "200000" },
  { label: "Rs. 200,000 – Rs. 400,000", min: "200000", max: "400000" },
  { label: "Over Rs. 400,000",          min: "400000", max: ""       },
];

export function FilterSidebar({
  categories,
  brands,
  currentCategory,
  currentBrand,
  currentMinPrice,
  currentMaxPrice,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const hasFilters = currentCategory || currentBrand || currentMinPrice || currentMaxPrice;

  const currentPriceRange = PRICE_RANGES.find(
    (r) => r.min === currentMinPrice && r.max === (currentMaxPrice ?? "")
  );

  return (
    <aside className="space-y-6">
      {hasFilters && (
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearAll}>
          <X className="w-3.5 h-3.5 mr-1" />
          Clear Filters
        </Button>
      )}

      {/* Categories */}
      <div>
        <p className="font-semibold text-sm mb-3">Category</p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam("category", null)}
              className={cn(
                "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                !currentCategory ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
              )}
            >
              All Categories
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam("category", cat.slug)}
                className={cn(
                  "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                  currentCategory === cat.slug ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <p className="font-semibold text-sm mb-3">Price Range</p>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => { updateParam("minPrice", null); updateParam("maxPrice", null); }}
              className={cn(
                "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                !currentPriceRange ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
              )}
            >
              Any Price
            </button>
          </li>
          {PRICE_RANGES.map((r) => (
            <li key={r.label}>
              <button
                onClick={() => {
                  updateParam("minPrice", r.min);
                  updateParam("maxPrice", r.max || null);
                }}
                className={cn(
                  "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                  currentPriceRange?.label === r.label
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent"
                )}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <p className="font-semibold text-sm mb-3">Brand</p>
        <ul className="space-y-1 max-h-52 overflow-y-auto">
          <li>
            <button
              onClick={() => updateParam("brand", null)}
              className={cn(
                "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                !currentBrand ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
              )}
            >
              All Brands
            </button>
          </li>
          {brands.map((brand) => (
            <li key={brand.id}>
              <button
                onClick={() => updateParam("brand", brand.slug)}
                className={cn(
                  "text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors",
                  currentBrand === brand.slug ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent"
                )}
              >
                {brand.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
