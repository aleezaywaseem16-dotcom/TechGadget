import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = { title: "My Profile" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/signin?redirectTo=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm
        initialData={{
          full_name: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          email: profile?.email ?? user.email ?? "",
        }}
      />
    </div>
  );
}
