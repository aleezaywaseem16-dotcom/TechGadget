"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 499;
const TAX_RATE = 0.17;

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem } = useCartStore();

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = totalPrice * TAX_RATE;
  const total = totalPrice + shipping + tax;
  const freeShippingLeft = SHIPPING_THRESHOLD - totalPrice;

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild>
          <Link href="/shop">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart <span className="text-muted-foreground font-normal text-lg">({items.length} {items.length === 1 ? "item" : "items"})</span></h1>

      {/* Free shipping banner */}
      {freeShippingLeft > 0 && (
        <div className="mb-6 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-sm text-indigo-700 dark:text-indigo-300">
          Add <strong>{formatPrice(freeShippingLeft)}</strong> more to get <strong>free delivery!</strong>
        </div>
      )}
      {freeShippingLeft <= 0 && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300">
          🎉 You qualify for <strong>free shipping!</strong>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 p-4 border rounded-2xl bg-card">
              <Link href={`/product/${item.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.slug}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 mb-1 block">
                  {item.name}
                </Link>
                <p className="text-sm font-semibold mb-3">{formatPrice(item.price)}</p>

                <div className="flex items-center justify-between">
                  {/* Quantity stepper */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="border rounded-2xl p-6 bg-card sticky top-24">
            <h2 className="font-bold text-lg mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (17%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>

            <Separator className="mb-5" />

            <div className="flex justify-between font-bold text-base mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button asChild className="w-full h-11 text-base" size="lg">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full mt-3 text-sm">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
