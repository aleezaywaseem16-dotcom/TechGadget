"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
}

export function WishlistButton({ productId, productName, className }: WishlistButtonProps) {
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(productId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
    if (wishlisted) {
      toast.info(`${productName} removed from wishlist.`);
    } else {
      toast.success(`${productName} added to wishlist!`);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
        "bg-white/90 dark:bg-gray-800/90 shadow-sm hover:scale-110",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-colors",
          wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-500 dark:text-gray-400"
        )}
      />
    </button>
  );
}
