import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { AdminAnalyticsCharts } from "@/components/admin/AdminAnalyticsCharts";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  // Revenue per day — last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: orders } = await supabase
    .from("orders")
    .select("total, created_at, payment_status, status")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at");

  // Top products by order items
  const { data: topItems } = await supabase
    .from("order_items")
    .select("product_name, quantity, subtotal")
    .order("subtotal", { ascending: false })
    .limit(10);

  // Aggregate revenue by day
  const revenueByDay: Record<string, number> = {};
  (orders ?? [])
    .filter((o) => o.payment_status === "paid")
    .forEach((o) => {
      const day = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      revenueByDay[day] = (revenueByDay[day] ?? 0) + o.total;
    });

  const revenueData = Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue }));

  // Orders by status
  const statusCounts: Record<string, number> = {};
  (orders ?? []).forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

  // Summary stats
  const totalRevenue = (orders ?? []).filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalRevenue / Math.max((orders ?? []).length, 1);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Analytics</h1>
      <p className="text-muted-foreground text-sm mb-8">Last 30 days</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Revenue (30d)", value: formatPrice(totalRevenue) },
          { label: "Orders (30d)", value: (orders ?? []).length.toString() },
          { label: "Avg. Order Value", value: formatPrice(avgOrderValue) },
          { label: "Paid Orders", value: (orders ?? []).filter((o) => o.payment_status === "paid").length.toString() },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5">
            <p className="text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <AdminAnalyticsCharts
        revenueData={revenueData}
        statusData={statusData}
        topItems={(topItems ?? []).map((i) => ({ name: i.product_name, revenue: i.subtotal }))}
      />
    </div>
  );
}
