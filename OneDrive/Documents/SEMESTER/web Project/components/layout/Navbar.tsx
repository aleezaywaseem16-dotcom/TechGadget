"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Zap,
  Search,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth";

interface NavbarProps {
  user?: { email: string } | null;
  isAdmin?: boolean;
}

const CATEGORIES = [
  { name: "Smartphones", slug: "smartphones" },
  { name: "Laptops", slug: "laptops" },
  { name: "Gaming", slug: "gaming" },
  { name: "Smart Watches", slug: "smart-watches" },
  { name: "Audio Devices", slug: "audio-devices" },
  { name: "Cameras", slug: "cameras" },
  { name: "Computer Accessories", slug: "computer-accessories" },
  { name: "Mobile Accessories", slug: "mobile-accessories" },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
];

export function Navbar({ user, isAdmin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const totalItems = useCartStore((s) => s.totalItems);
  const wishlistCount = useWishlistStore((s) => s.count);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-white dark:bg-gray-950 border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                TechGadget
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {l.label}
                </Link>
              ))}

              {/* Categories dropdown */}
              <div className="relative" onMouseLeave={() => setCatOpen(false)}>
                <button
                  onMouseEnter={() => setCatOpen(true)}
                  onClick={() => setCatOpen((o) => !o)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  Categories <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", catOpen && "rotate-180")} />
                </button>
                {catOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-sm">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 h-9 rounded-full border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
                />
              </form>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto lg:ml-0">
              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen((o) => !o)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Button>

              <ThemeToggle />

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative" aria-label="Wishlist">
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {wishlistCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Account — desktop */}
              {user ? (
                <div className="relative hidden lg:block" onMouseLeave={() => setUserMenuOpen(false)}>
                  <button
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Account menu"
                  >
                    <User className="w-5 h-5" />
                    <span className="max-w-[100px] truncate hidden xl:inline">{user.email.split("@")[0]}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                      <p className="px-4 py-1.5 text-xs text-muted-foreground truncate border-b mb-1">{user.email}</p>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors">
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors">
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          disabled={isPending}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}

              {/* Mobile account icon */}
              <Link href={user ? "/account" : "/signin"} className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-9 pr-4 h-10 rounded-full border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background"
                />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="relative z-50 w-72 max-w-full bg-background border-r border-border shadow-2xl flex flex-col py-6 px-4 overflow-y-auto">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-6" onClick={() => setMobileOpen(false)}>
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                TechGadget
              </span>
            </Link>

            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium border-b border-border last:border-0 hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ))}

            <p className="mt-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-sm border-b border-border last:border-0 hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <div className="mt-auto pt-6 space-y-3">
              {user ? (
                <>
                  <p className="text-xs text-muted-foreground truncate px-1">{user.email}</p>
                  <Button asChild variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/account">My Account</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/account/orders">My Orders</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => { setMobileOpen(false); handleSignOut(); }}
                    disabled={isPending}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full" onClick={() => setMobileOpen(false)}>
                    <Link href="/signup">Create Account</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
