import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Load stats in parallel
  const [ordersRes, productsRes, usersRes, recentOrdersRes] = await Promise.all([
    supabase.from("orders").select("total, status, payment_status, created_at"),
    supabase.from("products").select("id, status", { count: "exact" }),
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase
      .from("orders")
      .select("id, order_number, status, total, payment_status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders.filter((o) => o.payment_status === "paid").reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;
  const totalProducts = productsRes.count ?? 0;
  const totalUsers = usersRes.count ?? 0;

  const STATS = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Products", value: totalProducts.toString(), icon: Package, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { label: "Customers", value: totalUsers.toString(), icon: Users, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400",
    delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {pendingOrders > 0 && <span className="text-amber-600 font-medium">{pendingOrders} orders need attention · </span>}
          Welcome back!
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-semibold">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        {!recentOrdersRes.data?.length ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-20" />
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Order #</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersRes.data.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold">{order.order_number}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[order.status] ?? ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
