import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export const metadata: Metadata = { title: "My Orders" };

const STATUS_COLORS: Record<string, "default" | "warning" | "success" | "destructive" | "secondary"> = {
  pending:    "warning",
  processing: "default",
  shipped:    "default",
  delivered:  "success",
  cancelled:  "destructive",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?redirectTo=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {!orders?.length ? (
        <div className="text-center py-20 border rounded-xl">
          <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders as Order[]).map((order) => (
            <div key={order.id} className="border rounded-xl p-5 bg-card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_COLORS[order.status] ?? "secondary"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}
              </p>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/account/orders/${order.id}`}>View Details</Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
