"use client";

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface AdminAnalyticsChartsProps {
  revenueData: { date: string; revenue: number }[];
  statusData: { status: string; count: number }[];
  topItems: { name: string; revenue: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#0ea5e9",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export function AdminAnalyticsCharts({ revenueData, statusData, topItems }: AdminAnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue over time */}
      <div className="lg:col-span-2 rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-6">Revenue (30 days)</h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `Rs.${Number(v).toLocaleString("en-PK")}`} />
              <Tooltip formatter={(v) => [`Rs. ${Number(v).toLocaleString("en-PK")}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-60 flex items-center justify-center text-muted-foreground text-sm">No revenue data yet</div>
        )}
      </div>

      {/* Orders by status */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-6">Orders by Status</h2>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="status" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#0ea5e9"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No order data</div>
        )}
      </div>

      {/* Top products */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="font-semibold mb-6">Top Products by Revenue</h2>
        {topItems.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topItems.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `Rs.${Number(v).toLocaleString("en-PK")}`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(v) => [`Rs. ${Number(v).toLocaleString("en-PK")}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No sales data</div>
        )}
      </div>
    </div>
  );
}
