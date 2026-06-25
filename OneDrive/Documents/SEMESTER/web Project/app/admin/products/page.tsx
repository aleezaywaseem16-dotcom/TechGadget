import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, stock_quantity, status, sku, category:categories(name), brand:brands(name)")
    .order("created_at", { ascending: false });

  const STATUS_COLORS: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    archived: "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild size="sm">
          <Link href="/admin/products/new">
            <Plus className="w-4 h-4" />Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Name", "SKU", "Category", "Price", "Stock", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products ?? []).map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium line-clamp-1">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{(p.brand as unknown as {name:string}|null)?.name}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs">{p.sku}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{(p.category as unknown as {name:string}|null)?.name}</td>
                  <td className="px-5 py-3.5 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-5 py-3.5">
                    <span className={p.stock_quantity === 0 ? "text-red-500 font-medium" : ""}>{p.stock_quantity}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[p.status] ?? ""}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/products/${p.id}`} className="text-primary text-xs hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
              {!products?.length && (
                <tr><td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
