import type { Metadata } from "next";
import { Shield, Zap, Truck, Users } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const VALUES = [
  {
    icon: Shield,
    title: "100% Genuine Products",
    desc: "Every product we sell is sourced directly from authorized distributors and manufacturers. No counterfeits, ever.",
  },
  {
    icon: Zap,
    title: "Best Prices in Pakistan",
    desc: "We negotiate directly with brands to bring you market-competitive prices you won't find anywhere else.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    desc: "We deliver to all major cities across Pakistan in 2–5 business days, with same-day delivery in Islamabad.",
  },
  {
    icon: Users,
    title: "Expert Support",
    desc: "Our team of tech enthusiasts is available 6 days a week to help you choose the right product.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4">Pakistan&apos;s Premier Tech Store</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          TechGadget was founded in 2020 with a simple mission: make premium technology accessible to everyone in Pakistan.
          From flagship smartphones to professional cameras, we bring the world&apos;s best tech to your doorstep.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {[
          { value: "50,000+", label: "Happy Customers" },
          { value: "500+",    label: "Products" },
          { value: "30+",     label: "Top Brands" },
          { value: "4.8★",    label: "Customer Rating" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border bg-card p-6 text-center">
            <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <h2 className="text-2xl font-bold mb-6 text-center">Why Choose TechGadget?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-2xl border bg-card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <v.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">{v.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="rounded-2xl border bg-card p-8">
        <h2 className="text-xl font-bold mb-4">Our Story</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-3">
          <p>
            TechGadget started as a small online shop in Islamabad, run by a group of tech enthusiasts who were frustrated
            by the lack of reliable, fairly-priced tech retail options in Pakistan. We saw friends and family paying
            inflated prices or receiving counterfeit products &mdash; and we knew we could do better.
          </p>
          <p>
            Today, we serve customers across all major cities — Karachi, Lahore, Islamabad, Peshawar, Faisalabad and beyond.
            We&apos;ve partnered with authorized distributors for Apple, Samsung, Sony, Dell, ASUS, and dozens more brands to
            ensure every product you receive is genuine, warranty-backed, and fairly priced.
          </p>
          <p>
            Our warehouse in Islamabad dispatches orders 6 days a week, and our support team responds to every query
            within hours. We believe great tech should be accessible to every Pakistani &mdash; and we&apos;re committed to making that happen.
          </p>
        </div>
      </div>
    </div>
  );
}
