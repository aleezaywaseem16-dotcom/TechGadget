"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, MapPin, Trash2, Star, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AddressManagerProps {
  initialAddresses: Address[];
  userId: string;
}

const EMPTY_FORM = {
  label: "",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "Pakistan",
};

export function AddressManager({ initialAddresses, userId }: AddressManagerProps) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const set = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const deleteAddress = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("Address removed.");
  };

  const setDefault = async (id: string) => {
    const supabase = createClient();
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    toast.success("Default address updated.");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.full_name || !form.phone || !form.line1 || !form.city || !form.state) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const isFirst = addresses.length === 0;
    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: userId,
        label: form.label,
        full_name: form.full_name,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2 || null,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: form.country,
        is_default: isFirst,
      })
      .select()
      .single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => [...prev, data as Address]);
    setForm(EMPTY_FORM);
    setShowForm(false);
    toast.success("Address saved.");
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 && !showForm ? (
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

      {showForm ? (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">New Address</p>
              <Button size="icon" variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Label <span className="text-destructive">*</span></Label>
                  <Input placeholder="Home / Office / Other" value={form.label} onChange={set("label")} disabled={saving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Full Name <span className="text-destructive">*</span></Label>
                  <Input placeholder="Recipient name" value={form.full_name} onChange={set("full_name")} disabled={saving} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone <span className="text-destructive">*</span></Label>
                <Input type="tel" placeholder="03XX-XXXXXXX" value={form.phone} onChange={set("phone")} disabled={saving} />
              </div>
              <div className="space-y-1.5">
                <Label>Address Line 1 <span className="text-destructive">*</span></Label>
                <Input placeholder="Street address, house/flat no." value={form.line1} onChange={set("line1")} disabled={saving} />
              </div>
              <div className="space-y-1.5">
                <Label>Address Line 2</Label>
                <Input placeholder="Sector, block, landmark (optional)" value={form.line2} onChange={set("line2")} disabled={saving} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City <span className="text-destructive">*</span></Label>
                  <Input placeholder="Karachi, Lahore, Islamabad…" value={form.city} onChange={set("city")} disabled={saving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Province <span className="text-destructive">*</span></Label>
                  <Input placeholder="Punjab, Sindh, KPK…" value={form.state} onChange={set("state")} disabled={saving} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Postal Code</Label>
                  <Input placeholder="e.g. 44000" value={form.postal_code} onChange={set("postal_code")} disabled={saving} />
                </div>
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={set("country")} disabled={saving} />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={saving}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving…</> : "Save Address"}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      )}
    </div>
  );
}
