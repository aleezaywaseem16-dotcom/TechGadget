"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactResult =
  | { error: string; success?: never }
  | { success: string; error?: never };

export async function submitContactAction(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ContactResult> {
  if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
    return { error: "Please fill in all required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email.trim())) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim() || "General Inquiry",
      message: data.message.trim(),
    });
    if (error) throw error;
    return { success: "Message sent! We’ll get back to you within 24 hours." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong.";
    console.error("[contact]", msg);
    return { error: "Failed to send your message. Please try again or email us directly." };
  }
}
