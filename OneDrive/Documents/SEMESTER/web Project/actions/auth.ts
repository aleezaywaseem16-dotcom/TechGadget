"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult =
  | { error: string; success?: never }
  | { success: string; error?: never };

export async function signInAction(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return { error: error.message || JSON.stringify(error) || "Sign in failed" };

    revalidatePath("/", "layout");
    return { success: "Welcome back! Redirecting…" };
  } catch (e) {
    return { error: e instanceof Error ? e.message : JSON.stringify(e) };
  }
}

export async function signUpAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  let step = "init";
  try {
    step = "createClient";
    const supabase = await createClient();

    step = "signUp";
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: `${data.firstName} ${data.lastName}`.trim(),
        },
      },
    });

    step = "checkError";
    if (error) return { error: `[${step}] ${error.message || JSON.stringify(error) || "Sign up failed"}` };

    step = "done";
    return { success: `Account created! User: ${authData?.user?.id ?? "none"}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : JSON.stringify(e);
    return { error: `[failed at: ${step}] ${msg}` };
  }
}

export async function resetPasswordAction(
  email: string
): Promise<AuthResult> {
  const supabase = await createClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/account/settings?tab=password`,
  });

  if (error) return { error: error.message };
  return { success: "Password reset link sent to your inbox!" };
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/signin");
}

export async function updateProfileAction(data: {
  full_name: string;
  phone: string;
}): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: data.full_name, phone: data.phone || null })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/account");
  return { success: "Profile updated successfully!" };
}

export async function updatePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<AuthResult> {
  const supabase = await createClient();

  // Verify current password by signing in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Not authenticated." };

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: data.currentPassword,
  });
  if (verifyError) return { error: "Current password is incorrect." };

  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  });
  if (error) return { error: error.message };

  return { success: "Password updated successfully!" };
}
