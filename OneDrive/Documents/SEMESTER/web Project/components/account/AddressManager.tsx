"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Address } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AddressManagerProps {
  initialAddresses: Address[];
  userId: string;
}

export function AddressManager({ initialAddresses, userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses);

  const deleteAddress = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const setDefault = async (id: string) => {
    const supabase = createClient();
    // unset all
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
    toast.success("Default address updated.");
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 ? (
        <div className="text-center py-16 border rounded-xl text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p>No saved addresses yet.</p>
        </div>
      ) : (
        addresses.map((addr) => (
          <Card key={addr.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{addr.label}</span>
                    {addr.is_default && <Badge variant="success">Default</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {addr.full_name} · {addr.phone}
                  </p>
                  <p className="text-sm">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""},{" "}
                    {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!addr.is_default && (
                    <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>
                      <Star className="w-3.5 h-3.5 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10"
                    onClick={() => deleteAddress(addr.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Button variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add New Address
      </Button>
    </div>
  );
}
