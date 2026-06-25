import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Category, Brand } from "@/types";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("brands").select("*").order("name"),
  ]);

  return (
    <div className="p-8">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
      <ProductForm
        categories={(categories as Category[]) ?? []}
        brands={(brands as Brand[]) ?? []}
      />
    </div>
  );
}
