"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, BarChart3, LogOut, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin",            label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products",   label: "Products",  icon: Package },
  { href: "/admin/categories", label: "Categories",icon: Tag },
  { href: "/admin/orders",     label: "Orders",    icon: ShoppingCart },
  { href: "/admin/users",      label: "Users",     icon: Users },
  { href: "/admin/analytics",  label: "Analytics", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 flex-shrink-0 border-r bg-card flex flex-col">
      <div className="p-5 border-b">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Store className="w-5 h-5" />
          <span className="font-bold text-sm">TechGadget Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
}
