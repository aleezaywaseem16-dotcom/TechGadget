import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: Set<string>;
  count: number;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  setWishlist: (productIds: string[]) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: new Set<string>(),
      count: 0,

      toggleWishlist: (productId) =>
        set((state) => {
          const next = new Set(state.productIds);
          if (next.has(productId)) {
            next.delete(productId);
          } else {
            next.add(productId);
          }
          return { productIds: next, count: next.size };
        }),

      isWishlisted: (productId) => get().productIds.has(productId),

      setWishlist: (productIds) =>
        set({ productIds: new Set(productIds), count: productIds.length }),
    }),
    {
      name: "techgadget-wishlist",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data?.state?.productIds && Array.isArray(data.state.productIds)) {
            data.state.productIds = new Set(data.state.productIds);
          }
          return data;
        },
        setItem: (name, value) => {
          const copy = { ...value, state: { ...value.state } };
          if (copy.state.productIds instanceof Set) {
            (copy.state as Record<string, unknown>).productIds = Array.from(copy.state.productIds);
          }
          localStorage.setItem(name, JSON.stringify(copy));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
