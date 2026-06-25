import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Orders" };

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
  delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "text-amber-600",
  paid: "text-emerald-600",
  failed: "text-red-600",
  refunded: "text-gray-500",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Order #", "Date", "Status", "Payment", "Total"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-semibold">{order.order_number}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-xs font-medium capitalize ${PAYMENT_COLORS[order.payment_status] ?? ""}`}>
                    {order.payment_status}
                  </td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(order.total)}</td>
                </tr>
              ))}
              {!orders?.length && (
                <tr><td colSpan={5} className="px-5 py-16 text-center text-muted-foreground">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
