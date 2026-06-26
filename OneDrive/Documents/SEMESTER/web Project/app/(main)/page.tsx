import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight, Zap, Shield, Truck, Headphones,
  Smartphone, Laptop, Gamepad2, Watch, Monitor, Plug,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/ProductCard";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/FadeIn";
import type { Product } from "@/types";

export const metadata: Metadata = {
  title: "TechGadget — Premium Tech Store Pakistan",
};

const CATEGORIES: { name: string; slug: string; Icon: LucideIcon; gradient: string }[] = [
  { name: "Smartphones",          slug: "smartphones",           Icon: Smartphone, gradient: "from-sky-500 to-blue-700" },
  { name: "Laptops",              slug: "laptops",               Icon: Laptop,     gradient: "from-slate-600 to-slate-900" },
  { name: "Gaming",               slug: "gaming",                Icon: Gamepad2,   gradient: "from-green-500 to-emerald-700" },
  { name: "Smart Watches",        slug: "smart-watches",         Icon: Watch,      gradient: "from-rose-500 to-pink-700" },
  { name: "Audio Devices",        slug: "audio-devices",         Icon: Headphones, gradient: "from-amber-500 to-orange-600" },
  { name: "Computer Accessories", slug: "computer-accessories",  Icon: Monitor,    gradient: "from-violet-500 to-purple-700" },
  { name: "Mobile Accessories",   slug: "mobile-accessories",    Icon: Plug,       gradient: "from-blue-500 to-indigo-700" },
];

const FEATURES = [
  { icon: Truck,      title: "Free Shipping",   desc: "On orders over Rs. 5,000" },
  { icon: Shield,     title: "Secure Payments", desc: "Protected by Stripe" },
  { icon: Zap,        title: "Fast Delivery",   desc: "2–5 business days" },
  { icon: Headphones, title: "24/7 Support",    desc: "We're here to help" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const [featuredRes, newRes] = await Promise.all([
    supabase
      .from("products")
      .select(`*, category:categories(id,name,slug), brand:brands(id,name), images:product_images(url,alt,position)`)
      .eq("status", "active")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("products")
      .select(`*, category:categories(id,name,slug), brand:brands(id,name), images:product_images(url,alt,position)`)
      .eq("status", "active")
      .eq("is_new_arrival", true)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const featured = (featuredRes.data ?? []) as unknown as Product[];
  const newArrivals = (newRes.data ?? []) as unknown as Product[];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.12)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 py-14 md:py-22 relative">
          <FadeIn direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 bg-sky-500/15 border border-sky-400/25 rounded-full px-4 py-1.5 text-sky-300 text-sm mb-6">
              <Zap className="w-3.5 h-3.5" />
              New Arrivals — Shop the Latest Tech
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
              The Future of Tech,{" "}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Delivered to You
              </span>
            </h1>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              Discover premium smartphones, laptops, gaming gear and more. Genuine products, best prices, lightning-fast delivery across Pakistan.
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <div className="flex flex-wrap gap-4">
              <Button size="xl" asChild className="bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25">
                <Link href="/shop">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/shop?featured=true">View Deals</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Trust Features Bar ───────────────────────────────────── */}
      <section className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-5">
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you&apos;re looking for</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/shop">View All <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/shop/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                <cat.Icon className="relative z-10 w-10 h-10 text-white drop-shadow" />
                <span className="relative z-10 text-white font-semibold text-sm text-center px-3 leading-tight drop-shadow">
                  {cat.name}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="border-t bg-muted/20">
          <div className="container mx-auto px-4 py-12">
            <FadeIn>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold">Featured Deals</h2>
                  <p className="text-muted-foreground mt-1">Handpicked products at the best prices</p>
                </div>
                <Button variant="outline" asChild className="hidden sm:flex">
                  <Link href="/shop?featured=true">See All <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p as Product & { category?: { name: string; slug: string } | null; brand?: { name: string } | null; images?: { url: string; alt: string | null; position: number }[] }} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ── New Arrivals ──────────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <FadeIn>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-1">The latest tech just landed</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/shop?sort=newest">Shop New <ArrowRight className="w-4 h-4" /></Link>
              </Button>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {newArrivals.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p as Product & { category?: { name: string; slug: string } | null; brand?: { name: string } | null; images?: { url: string; alt: string | null; position: number }[] }} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        </section>
      )}

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to upgrade your tech?
            </h2>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">
              Join thousands of satisfied customers. Free shipping on orders over Rs. 5,000.
            </p>
            <Button size="xl" asChild className="bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30">
              <Link href="/shop">Start Shopping <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
