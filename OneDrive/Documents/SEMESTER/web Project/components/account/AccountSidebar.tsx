"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Profile",    href: "/account",            icon: User },
  { label: "Orders",     href: "/account/orders",     icon: ShoppingBag },
  { label: "Wishlist",   href: "/wishlist",            icon: Heart },
  { label: "Addresses",  href: "/account/addresses",  icon: MapPin },
  { label: "Settings",   href: "/account/settings",   icon: Settings },
];

export function AccountSidebar({ userEmail, isAdmin }: { userEmail: string; isAdmin?: boolean }) {
  const pathname = usePathname();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <>
      <div className="rounded-xl border bg-card p-4 space-y-1">
        <p className="text-xs text-muted-foreground px-3 mb-3 truncate">{userEmail}</p>

        {NAV.map((item) => {
          const active = item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            Admin Panel
          </Link>
        )}

        <div className="pt-2 border-t mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowConfirm(true)}
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/40 mx-auto mb-4">
              <LogOut className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-lg font-semibold text-center mb-1">Sign out?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white"
                onClick={() => { setShowConfirm(false); handleSignOut(); }}
                disabled={isPending}
              >
                {isPending ? "Signing out…" : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
