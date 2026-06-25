"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthenticated");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
}

export async function createProductAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const slug = slugify(name);
  const price = Number(formData.get("price"));
  const compareAt = formData.get("compare_at_price") ? Number(formData.get("compare_at_price")) : null;
  const stock = Number(formData.get("stock_quantity") ?? 0);
  const imageUrls = (formData.get("image_urls") as string)
    .split("\n").map((s) => s.trim()).filter(Boolean);

  // Parse specs key:value pairs
  const specsRaw = (formData.get("specs") as string ?? "").split("\n").filter(Boolean);
  const specs: Record<string, string> = {};
  for (const line of specsRaw) {
    const [k, ...rest] = line.split(":");
    if (k && rest.length) specs[k.trim()] = rest.join(":").trim();
  }

  const { data: product, error } = await admin
    .from("products")
    .insert({
      name,
      slug,
      description: formData.get("description") as string,
      specs,
      price,
      compare_at_price: compareAt,
      category_id: formData.get("category_id") as string,
      brand_id: formData.get("brand_id") as string,
      stock_quantity: stock,
      sku: formData.get("sku") as string || slug.toUpperCase().replace(/-/g, "").slice(0, 12),
      status: formData.get("status") as string || "draft",
      is_featured: formData.get("is_featured") === "on",
      is_new_arrival: formData.get("is_new_arrival") === "on",
    })
    .select()
    .single();

  if (error || !product) return { error: error?.message ?? "Failed to create product" };

  if (imageUrls.length > 0) {
    await admin.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: product.id, url, alt: name, position: i + 1 }))
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const compareAt = formData.get("compare_at_price") ? Number(formData.get("compare_at_price")) : null;
  const imageUrls = (formData.get("image_urls") as string)
    .split("\n").map((s) => s.trim()).filter(Boolean);

  const specsRaw = (formData.get("specs") as string ?? "").split("\n").filter(Boolean);
  const specs: Record<string, string> = {};
  for (const line of specsRaw) {
    const [k, ...rest] = line.split(":");
    if (k && rest.length) specs[k.trim()] = rest.join(":").trim();
  }

  const { error } = await admin
    .from("products")
    .update({
      name,
      description: formData.get("description") as string,
      specs,
      price,
      compare_at_price: compareAt,
      category_id: formData.get("category_id") as string,
      brand_id: formData.get("brand_id") as string,
      stock_quantity: Number(formData.get("stock_quantity") ?? 0),
      sku: formData.get("sku") as string,
      status: formData.get("status") as string,
      is_featured: formData.get("is_featured") === "on",
      is_new_arrival: formData.get("is_new_arrival") === "on",
    })
    .eq("id", productId);

  if (error) return { error: error.message };

  if (imageUrls.length > 0) {
    await admin.from("product_images").delete().eq("product_id", productId);
    await admin.from("product_images").insert(
      imageUrls.map((url, i) => ({ product_id: productId, url, alt: name, position: i + 1 }))
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await assertAdmin();
  const admin = createAdminClient();
  await admin.from("product_images").delete().eq("product_id", productId);
  await admin.from("products").delete().eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
