import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const metadata: Metadata = { title: "Orders" };

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  shipped:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
  delivered:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending:  "text-amber-600",
  paid:     "text-emerald-600",
  failed:   "text-red-600",
  refunded: "text-gray-500",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profile:profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const totalRevenue = (orders ?? [])
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {(orders ?? []).length} total · {formatPrice(totalRevenue)} revenue
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Order #", "Customer", "Date", "Status", "Payment", "Total"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders ?? []).map((order) => {
                const customer = order.profile as { full_name: string | null; email: string | null } | null;
                const addr = order.shipping_address as { full_name?: string } | null;
                const customerName = customer?.full_name ?? addr?.full_name ?? "Guest";

                return (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-xs">{order.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{customerName}</p>
                      {customer?.email && (
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                        statusColors={STATUS_COLORS}
                      />
                    </td>
                    <td className={`px-5 py-3.5 text-xs font-medium capitalize ${PAYMENT_COLORS[order.payment_status] ?? ""}`}>
                      {order.payment_status}
                    </td>
                    <td className="px-5 py-3.5 font-semibold whitespace-nowrap">{formatPrice(order.total)}</td>
                  </tr>
                );
              })}
              {!orders?.length && (
                <tr><td colSpan={6} className="px-5 py-16 text-center text-muted-foreground">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
