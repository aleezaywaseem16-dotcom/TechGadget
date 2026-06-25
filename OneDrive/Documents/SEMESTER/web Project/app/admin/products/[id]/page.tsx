import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { deleteProductAction } from "@/actions/admin-products";
import { Button } from "@/components/ui/button";
import type { Category, Brand, Product, ProductImage } from "@/types";

export const metadata: Metadata = { title: "Edit Product" };

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }, { data: brands }] = await Promise.all([
    supabase.from("products").select("*, images:product_images(*)").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("brands").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <form action={deleteProductAction.bind(null, id)}>
          <Button type="submit" variant="destructive" size="sm"
            onClick={(e) => { if (!confirm("Delete this product? This cannot be undone.")) e.preventDefault(); }}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </form>
      </div>

      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
      <ProductForm
        categories={(categories as Category[]) ?? []}
        brands={(brands as Brand[]) ?? []}
        product={product as unknown as Product & { images?: ProductImage[] }}
      />
    </div>
  );
}
