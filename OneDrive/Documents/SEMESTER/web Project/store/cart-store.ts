import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocalCartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: LocalCartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<LocalCartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

function calcTotals(items: LocalCartItem[]) {
  return {
    totalItems: items.reduce((acc, i) => acc + i.quantity, 0),
    totalPrice: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const newItems: LocalCartItem[] = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
                  : i
              )
            : [...state.items, { ...item, quantity: item.quantity ?? 1 }];
          return { items: newItems, ...calcTotals(newItems) };
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return { items: newItems, ...calcTotals(newItems) };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity } : i
                );
          return { items: newItems, ...calcTotals(newItems) };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    { name: "techgadget-cart" }
  )
);
