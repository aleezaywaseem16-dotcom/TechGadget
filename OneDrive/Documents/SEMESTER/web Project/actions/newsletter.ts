"use server";

import { createClient } from "@/lib/supabase/server";

export type NewsletterResult =
  | { error: string; success?: never }
  | { success: string; error?: never };

export async function subscribeToNewsletterAction(email: string): Promise<NewsletterResult> {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmed || !emailRegex.test(trimmed)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscriptions").upsert(
      { email: trimmed, is_active: true },
      { onConflict: "email" }
    );
    if (error) throw error;
    return { success: "You’re subscribed! Welcome to the TechGadget family." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[newsletter]", msg);
    return { error: "Subscription failed. Please try again." };
  }
}
