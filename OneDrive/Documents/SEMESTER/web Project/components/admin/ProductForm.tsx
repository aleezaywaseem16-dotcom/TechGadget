"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createProductAction, updateProductAction } from "@/actions/admin-products";
import type { Category, Brand, Product, ProductImage } from "@/types";

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  product?: Product & { images?: ProductImage[] };
}

export function ProductForm({ categories, brands, product }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEdit = !!product;

  const specsToText = (specs: Record<string, string>) =>
    Object.entries(specs ?? {}).map(([k, v]) => `${k}: ${v}`).join("\n");

  const imagesToText = (images: ProductImage[] = []) =>
    images.sort((a, b) => a.position - b.position).map((i) => i.url).join("\n");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(product!.id, formData)
        : await createProductAction(formData);
      if (result?.error) toast.error(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-base">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" name="name" required defaultValue={product?.name} placeholder="e.g. iPhone 16 Pro Max" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="Auto-generated if empty" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status *</Label>
            <select id="status" name="status" defaultValue={product?.status ?? "draft"}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category_id">Category *</Label>
            <select id="category_id" name="category_id" required defaultValue={product?.category_id}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select category…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brand_id">Brand *</Label>
            <select id="brand_id" name="brand_id" required defaultValue={product?.brand_id}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select brand…</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" required rows={4} defaultValue={product?.description}
              placeholder="Detailed product description…" />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        <h2 className="font-semibold text-base">Pricing & Inventory</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (PKR) *</Label>
            <Input id="price" name="price" type="number" required min={0} step={1}
              defaultValue={product?.price} placeholder="e.g. 349999" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="compare_at_price">Compare-at Price (PKR)</Label>
            <Input id="compare_at_price" name="compare_at_price" type="number" min={0} step={1}
              defaultValue={product?.compare_at_price ?? ""} placeholder="Original / MRP" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stock_quantity">Stock Qty *</Label>
            <Input id="stock_quantity" name="stock_quantity" type="number" required min={0}
              defaultValue={product?.stock_quantity ?? 0} />
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <h2 className="font-semibold text-base">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured}
              className="w-4 h-4 rounded border-input accent-primary" />
            <span className="text-sm font-medium">Featured Deal</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" name="is_new_arrival" defaultChecked={product?.is_new_arrival}
              className="w-4 h-4 rounded border-input accent-primary" />
            <span className="text-sm font-medium">New Arrival</span>
          </label>
        </div>
      </div>

      {/* Specs */}
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-base">Specifications</h2>
        <p className="text-xs text-muted-foreground">One spec per line in <code>Key: Value</code> format</p>
        <Textarea id="specs" name="specs" rows={6}
          defaultValue={product?.specs ? specsToText(product.specs) : ""}
          placeholder={"Display: 6.9-inch Super Retina XDR\nProcessor: A18 Pro\nRAM: 8GB"} />
      </div>

      {/* Images */}
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <h2 className="font-semibold text-base">Product Images</h2>
        <p className="text-xs text-muted-foreground">One Unsplash URL per line. First URL = main image. Use <strong>images.unsplash.com</strong> — manufacturer CDN links are blocked by hotlink protection.</p>
        <Textarea id="image_urls" name="image_urls" rows={5}
          defaultValue={product?.images ? imagesToText(product.images) : ""}
          placeholder={"https://images.unsplash.com/photo-XXXX?w=600&h=600&fit=crop&auto=format\nhttps://images.unsplash.com/photo-XXXX?w=600&h=600&fit=crop&auto=format"} />
      </div>

      <div className="flex gap-3 pb-8">
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />{isEdit ? "Save Changes" : "Create Product"}</>}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
      </div>
    </form>
  );
}
