"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { placeCODOrder, placeDemoOrder, createStripeSession } from "@/actions/checkout";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, Lock, Truck, Check, Banknote, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "shipping" | "payment" | "review";
type PaymentMethod = "cod" | "demo" | "stripe";

const STEPS: { id: Step; label: string }[] = [
  { id: "shipping", label: "Shipping" },
  { id: "payment",  label: "Payment"  },
  { id: "review",   label: "Review"   },
];

const SHIPPING_FEE       = 499;
const SHIPPING_THRESHOLD = 5000;
const TAX_RATE           = 0.17;

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  icon: typeof Banknote;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}[] = [
  {
    id: "cod",
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay in cash when your order arrives at your doorstep. No upfront payment needed.",
    badge: "Most Popular",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  {
    id: "demo",
    icon: Zap,
    title: "Demo Pay",
    description: "Instantly marks your order as paid — no real payment, perfect for testing.",
    badge: "Demo Mode",
    badgeColor: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  },
  {
    id: "stripe",
    icon: CreditCard,
    title: "Pay with Card",
    description: "Secure card payment via Stripe. Requires Stripe API keys to be configured.",
    badge: "Requires Stripe",
    badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep]                     = useState<Step>("shipping");
  const [paymentMethod, setPaymentMethod]   = useState<PaymentMethod>("cod");
  const [isPending, startTransition]        = useTransition();

  const [shipping_data, setShippingData] = useState({
    fullName: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", postalCode: "", country: "Pakistan",
  });

  const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax         = Math.round(totalPrice * TAX_RATE);
  const total       = totalPrice + shippingFee + tax;

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground mb-6">Your cart is empty.</p>
        <Button asChild><Link href="/shop">Browse Products</Link></Button>
      </div>
    );
  }

  const orderPayload = {
    items: items.map((i) => ({
      productId: i.productId, name: i.name,
      price: i.price, quantity: i.quantity, image: i.image,
    })),
    shippingAddress: shipping_data,
    shipping: shippingFee,
    tax,
    total,
  };

  const handlePlaceOrder = () => {
    startTransition(async () => {
      try {
        if (paymentMethod === "cod") {
          const result = await placeCODOrder(orderPayload);
          if ("error" in result) { toast.error(result.error); return; }
          clearCart();
          router.push(`/checkout/success?order=${result.orderNumber}&method=cod`);

        } else if (paymentMethod === "demo") {
          const result = await placeDemoOrder(orderPayload);
          if ("error" in result) { toast.error(result.error); return; }
          clearCart();
          router.push(`/checkout/success?order=${result.orderNumber}&method=demo`);

        } else {
          const result = await createStripeSession(orderPayload);
          if ("error" in result) { toast.error(result.error); return; }
          if (result.url) { clearCart(); router.push(result.url); }
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const selectedOption = PAYMENT_OPTIONS.find((o) => o.id === paymentMethod)!;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to cart
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={cn("flex items-center gap-2", i <= stepIndex ? "text-primary" : "text-muted-foreground")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-semibold transition-colors",
                i < stepIndex  ? "bg-primary border-primary text-primary-foreground" :
                i === stepIndex ? "border-primary text-primary" : "border-muted-foreground/30"
              )}>
                {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="hidden sm:block text-sm font-medium">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("flex-1 h-0.5 mx-3 transition-colors", i < stepIndex ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left panel ── */}
        <div className="flex-1">

          {/* Step 1: Shipping */}
          {step === "shipping" && (
            <form onSubmit={(e) => { e.preventDefault(); setStep("payment"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" required value={shipping_data.fullName}
                    onChange={(e) => setShippingData((d) => ({ ...d, fullName: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={shipping_data.email}
                    onChange={(e) => setShippingData((d) => ({ ...d, email: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" required placeholder="03XX-XXXXXXX" value={shipping_data.phone}
                    onChange={(e) => setShippingData((d) => ({ ...d, phone: e.target.value }))} />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="line1">Street Address *</Label>
                  <Input id="line1" required placeholder="House no., street, area" value={shipping_data.line1}
                    onChange={(e) => setShippingData((d) => ({ ...d, line1: e.target.value }))} />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="line2">Address Line 2</Label>
                  <Input id="line2" placeholder="Apartment, block, floor (optional)" value={shipping_data.line2}
                    onChange={(e) => setShippingData((d) => ({ ...d, line2: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" required placeholder="e.g. Karachi" value={shipping_data.city}
                    onChange={(e) => setShippingData((d) => ({ ...d, city: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">Province *</Label>
                  <select id="state" required value={shipping_data.state}
                    onChange={(e) => setShippingData((d) => ({ ...d, state: e.target.value }))}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select province…</option>
                    {["Punjab","Sindh","Khyber Pakhtunkhwa","Balochistan","Islamabad Capital Territory","Gilgit-Baltistan","Azad Kashmir"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" placeholder="e.g. 75500" value={shipping_data.postalCode}
                    onChange={(e) => setShippingData((d) => ({ ...d, postalCode: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={shipping_data.country} readOnly className="bg-muted/50 cursor-not-allowed" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4 h-11">
                Continue to Payment <CreditCard className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* Step 2: Payment method */}
          {step === "payment" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <button onClick={() => setStep("shipping")} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Edit shipping
                </button>
              </div>

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={cn(
                        "w-full text-left rounded-2xl border-2 p-5 transition-all duration-200",
                        selected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                          selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{opt.title}</span>
                            {opt.badge && (
                              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", opt.badgeColor)}>
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                          {opt.id === "cod" && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              <Shield className="w-3.5 h-3.5" />
                              100% safe — only pay when you receive your order
                            </div>
                          )}
                          {opt.id === "stripe" && (
                            <div className="mt-3 flex gap-1.5">
                              {["VISA", "MC", "AMEX"].map((m) => (
                                <span key={m} className="px-2 py-0.5 border rounded text-[10px] font-mono font-semibold">{m}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all",
                          selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                        )}>
                          {selected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button onClick={() => { setStep("review"); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full h-11">
                Review Order <Check className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Review & confirm */}
          {step === "review" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Review Your Order</h2>
                <button onClick={() => setStep("payment")} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Edit payment
                </button>
              </div>

              {/* Items */}
              <div className="rounded-2xl border bg-card p-5 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Delivery address summary */}
              <div className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">Delivering to</p>
                  <button onClick={() => setStep("shipping")} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {shipping_data.fullName} · {shipping_data.phone}<br />
                    {shipping_data.line1}{shipping_data.line2 ? `, ${shipping_data.line2}` : ""}<br />
                    {shipping_data.city}, {shipping_data.state}, Pakistan
                  </p>
                </div>
              </div>

              {/* Payment method summary */}
              <div className="rounded-2xl border bg-card p-5">
                <p className="font-semibold text-sm mb-2">Payment</p>
                <div className="flex items-center gap-2">
                  <selectedOption.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedOption.title}</span>
                  {paymentMethod === "cod" && (
                    <span className="text-xs text-muted-foreground">— you pay on delivery</span>
                  )}
                </div>
              </div>

              {/* COD notice */}
              {paymentMethod === "cod" && (
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4 text-sm text-emerald-700 dark:text-emerald-400">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Cash on Delivery</strong> — Our delivery team will contact you before arrival.
                    Please have the exact amount ready: <strong>{formatPrice(total)}</strong>
                  </p>
                </div>
              )}

              {/* Place order button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isPending}
                size="lg"
                className={cn(
                  "w-full h-12 text-base font-semibold",
                  paymentMethod === "cod" && "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                )}
              >
                {isPending ? "Placing order…" :
                  paymentMethod === "cod"   ? `Place Order — Pay ${formatPrice(total)} on Delivery` :
                  paymentMethod === "demo"  ? `Demo Pay ${formatPrice(total)}` :
                  `Pay ${formatPrice(total)} via Stripe`}
                {paymentMethod === "cod"  && <Banknote className="w-4 h-4" />}
                {paymentMethod === "demo" && <Zap className="w-4 h-4" />}
                {paymentMethod === "stripe" && <Lock className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="border rounded-2xl p-6 bg-card sticky top-24">
            <h2 className="font-bold text-base mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                  <p className="text-xs flex-1 line-clamp-2">{item.name}</p>
                  <p className="text-xs font-semibold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <Separator className="mb-4" />
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className={shippingFee === 0 ? "text-emerald-600 font-medium" : ""}>
                  {shippingFee === 0 ? "Free" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (17%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
            </div>
            <Separator className="mb-4" />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            {shippingFee === 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                Free delivery applied!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
