"use client";

import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: Pick<Product, "id" | "name" | "slug" | "price" | "stock_quantity">;
  image: string;
  quantity?: number;
  variant?: "default" | "icon";
  className?: string;
}

export function AddToCartButton({
  product,
  image,
  quantity = 1,
  variant = "default",
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const outOfStock = product.stock_quantity === 0;

  const handleAdd = async () => {
    if (outOfStock || loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image,
      price: product.price,
      quantity,
    });
    setLoading(false);
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleAdd}
        disabled={outOfStock || loading}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
          outOfStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-emerald-500 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
          className
        )}
        aria-label="Add to cart"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : added ? (
          <Check className="w-4 h-4" />
        ) : (
          <ShoppingBag className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={outOfStock || loading}
      className={cn("w-full", className)}
      variant={outOfStock ? "outline" : "default"}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : added ? (
        <><Check className="w-4 h-4" />Added!</>
      ) : outOfStock ? (
        "Out of Stock"
      ) : (
        <><ShoppingBag className="w-4 h-4" />Add to Cart</>
      )}
    </Button>
  );
}
