"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Zap, Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction } from "@/actions/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction(email);
      if (result.error) {
        toast.error(result.error);
      } else {
        setSent(true);
        toast.success("Reset link sent! Check your inbox.");
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <Image
        src="/images/signin.avif"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-[440px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              TechGadget
            </span>
          </Link>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We&apos;ve sent a password reset link to{" "}
              <strong className="text-foreground">{email}</strong>. Follow the link to create a new password.
            </p>
            <Button asChild className="w-full">
              <Link href="/signin">Back to Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-1">Forgot Password?</h2>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isPending}
                  autoComplete="email"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
