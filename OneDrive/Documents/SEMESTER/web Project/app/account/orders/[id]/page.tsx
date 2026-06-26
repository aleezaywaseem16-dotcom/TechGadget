import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Details" };

interface Props { params: Promise<{ id: string }> }

const STATUS_STEPS = ["pending", "processing", "shipped", "delivered"];

const STATUS_ICON: Record<string, typeof Clock> = {
  pending:    Clock,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle,
  cancelled:  XCircle,
};

const STATUS_COLOR: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  shipped:    "bg-sky-100 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400",
  delivered:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const StatusIcon = STATUS_ICON[order.status] ?? Clock;
  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "cancelled";
  const address = order.shipping_address as Record<string, string> | null;

  return (
    <div>
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed {new Date(order.created_at).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_COLOR[order.status] ?? ""}`}>
          <StatusIcon className="w-4 h-4" />
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className="rounded-2xl border bg-card p-6 mb-6">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const Icon = STATUS_ICON[step]!;
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    } ${active ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-medium capitalize ${done ? "text-primary" : "text-muted-foreground"}`}>
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-colors ${i < stepIndex ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
          <h2 className="font-semibold mb-5">Items Ordered</h2>
          <div className="space-y-4">
            {(order.items ?? []).map((item: { id: string; product_name: string; unit_price: number; quantity: number; subtotal: number }) => (
              <div key={item.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm flex-shrink-0">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-5" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className={order.shipping_fee === 0 ? "text-emerald-600 font-medium" : ""}>
                {order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (17%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base pt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="space-y-4">
          {address && (
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-semibold mb-3 text-sm">Delivery Address</h2>
              <address className="not-italic text-sm text-muted-foreground space-y-0.5">
                <p className="font-medium text-foreground">{address.full_name}</p>
                <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                <p>{address.city}, {address.state}</p>
                <p>{address.postal_code}</p>
                <p>{address.country}</p>
                {address.phone && <p className="pt-1 font-medium text-foreground">{address.phone}</p>}
              </address>
            </div>
          )}

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold mb-3 text-sm">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="capitalize">{order.payment_provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium capitalize ${order.payment_status === "paid" ? "text-emerald-600" : order.payment_status === "failed" ? "text-red-500" : "text-amber-600"}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <p className="text-xs text-muted-foreground">
              Need help with this order?{" "}
              <Link href="/contact" className="text-primary hover:underline">contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
