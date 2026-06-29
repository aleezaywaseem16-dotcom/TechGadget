"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ReviewResult =
  | { error: string; success?: never }
  | { success: string; error?: never };

export async function submitReviewAction(data: {
  productId: string;
  productSlug: string;
  rating: number;
  title: string;
  comment: string;
}): Promise<ReviewResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to leave a review." };

  if (data.rating < 1 || data.rating > 5) return { error: "Rating must be between 1 and 5." };
  if (!data.comment.trim() || data.comment.trim().length < 10) return { error: "Review must be at least 10 characters." };
  if (data.comment.length > 1000) return { error: "Review must be under 1000 characters." };
  if (data.title && data.title.length > 100) return { error: "Title must be under 100 characters." };

  // One review per user per product
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", data.productId)
    .eq("user_id", user.id)
    .single();

  if (existing) return { error: "You have already reviewed this product." };

  const { error } = await supabase.from("reviews").insert({
    product_id: data.productId,
    user_id: user.id,
    rating: data.rating,
    title: data.title.trim() || null,
    comment: data.comment.trim(),
  });

  if (error) return { error: "Failed to submit review. Please try again." };

  // Recalculate avg rating on the product
  const { data: allRatings } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", data.productId);

  if (allRatings && allRatings.length > 0) {
    const avg = allRatings.reduce((s, r) => s + r.rating, 0) / allRatings.length;
    await supabase
      .from("products")
      .update({ rating_avg: Math.round(avg * 10) / 10, rating_count: allRatings.length })
      .eq("id", data.productId);
  }

  revalidatePath(`/product/${data.productSlug}`);
  return { success: "Review submitted! Thank you for your feedback." };
}
