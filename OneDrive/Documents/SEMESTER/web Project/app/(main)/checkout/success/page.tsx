import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Banknote, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; method?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { order, method } = await searchParams;
  const isCOD    = method === "cod";
  const isDemo   = method === "demo";
  const isStripe = !isCOD && !isDemo;

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-lg">
      {/* Icon */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
        isCOD ? "bg-emerald-100 dark:bg-emerald-950/30" : "bg-sky-100 dark:bg-sky-950/30"
      }`}>
        {isCOD
          ? <Banknote className="w-10 h-10 text-emerald-500" />
          : isDemo
          ? <Zap className="w-10 h-10 text-sky-500" />
          : <CheckCircle className="w-10 h-10 text-emerald-500" />
        }
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-3">
        {isCOD ? "Order Placed!" : "Order Confirmed!"}
      </h1>

      {/* Message */}
      <p className="text-muted-foreground mb-2">
        {isCOD
          ? "Your order has been placed successfully. Our delivery team will contact you before arrival."
          : isDemo
          ? "Demo order placed! Your order is marked as paid and processing."
          : "Thank you for your payment. Your order is now being processed."}
      </p>

      {/* COD reminder */}
      {isCOD && (
        <div className="mt-4 mb-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4 text-sm text-emerald-700 dark:text-emerald-400 text-left">
          <p className="font-semibold mb-1">Cash on Delivery — What to expect:</p>
          <ul className="space-y-1 text-xs list-disc list-inside">
            <li>Delivery within 3–5 business days</li>
            <li>Our rider will call you before arriving</li>
            <li>Please keep the exact amount ready</li>
          </ul>
        </div>
      )}

      {/* Order number badge */}
      {order && (
        <div className="mt-4 mb-8 inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-mono font-semibold">{order}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Button asChild>
          <Link href="/account/orders">
            Track My Order <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
