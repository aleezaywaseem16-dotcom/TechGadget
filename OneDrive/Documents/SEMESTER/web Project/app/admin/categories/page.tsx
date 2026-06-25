import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*, products:products(id)")
    .order("name");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                {["Name", "Slug", "Products"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(categories ?? []).map((cat) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{cat.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                  <td className="px-5 py-3.5">{(cat.products as {id:string}[])?.length ?? 0}</td>
                </tr>
              ))}
              {!categories?.length && (
                <tr><td colSpan={3} className="px-5 py-16 text-center text-muted-foreground">No categories</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
