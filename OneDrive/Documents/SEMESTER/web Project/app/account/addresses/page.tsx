import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddressManager } from "@/components/account/AddressManager";
import type { Address } from "@/types";

export const metadata: Metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?redirectTo=/account/addresses");

  const { data: addresses } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Addresses</h1>
      <AddressManager
        initialAddresses={(addresses as Address[]) ?? []}
        userId={user.id}
      />
    </div>
  );
}
