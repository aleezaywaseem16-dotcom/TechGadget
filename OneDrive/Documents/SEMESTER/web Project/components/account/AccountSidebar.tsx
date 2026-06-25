"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
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

export function AccountSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
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

      <div className="pt-2 border-t mt-2">
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
