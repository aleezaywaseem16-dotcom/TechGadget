"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "@/actions/auth";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [debugError, setDebugError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await signInAction(email, password);
        const raw = JSON.stringify(result);
        setDebugError("RAW RESULT: " + raw);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success(result.success ?? "Signed in successfully!");
          window.location.href = "/";
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        setDebugError("THROWN: " + msg);
        toast.error("Unexpected error: " + msg);
      }
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background image — migrated from original signin.avif */}
      <Image
        src="/images/signin.avif"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay — matches original rgba(0,0,0,0.45) */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-10">
        {/* Logo */}
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

        {debugError && <pre className="bg-red-100 text-red-800 text-xs p-3 rounded mb-4 whitespace-pre-wrap break-all">{debugError}</pre>}
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/reset-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
