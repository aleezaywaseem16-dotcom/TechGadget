"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  initialData: { full_name: string; phone: string; email: string };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<{ full_name?: string; phone?: string }>({});
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (data.full_name && !/^[A-Za-z\s]{2,50}$/.test(data.full_name.trim())) {
      errs.full_name = "Full name must be 2–50 letters only (no numbers or symbols).";
    }
    if (data.phone && !/^(\+92|0)3[0-9]{2}[-\s]?[0-9]{7}$/.test(data.phone.trim())) {
      errs.phone = "Enter a valid Pakistan mobile number (e.g. 0312-3456789 or +923123456789).";
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    startTransition(async () => {
      const result = await updateProfileAction({
        full_name: data.full_name,
        phone: data.phone,
      });
      if (result.error) toast.error(result.error);
      else toast.success(result.success!);
    });
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={data.full_name}
              onChange={set("full_name")}
              placeholder="Your full name"
              maxLength={50}
              disabled={isPending}
              className={cn(errors.full_name && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={data.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from here.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number <span className="text-muted-foreground font-normal">(Pakistan)</span></Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={set("phone")}
              placeholder="0312-3456789 or +923123456789"
              maxLength={16}
              disabled={isPending}
              className={cn(errors.phone && "border-destructive focus-visible:ring-destructive")}
            />
            {errors.phone
              ? <p className="text-xs text-destructive">{errors.phone}</p>
              : <p className="text-xs text-muted-foreground">Format: 03XX-XXXXXXX or +923XXXXXXXXX</p>}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
