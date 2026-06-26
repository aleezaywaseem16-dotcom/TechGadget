"use client";

import Link from "next/link";
import { Zap, Mail } from "lucide-react";

const SHOP_LINKS = [
  { label: "Smartphones", href: "/shop/smartphones" },
  { label: "Laptops", href: "/shop/laptops" },
  { label: "Gaming", href: "/shop/gaming" },
  { label: "Smart Watches", href: "/shop/smart-watches" },
  { label: "Audio Devices", href: "/shop/audio-devices" },
];

const ACCOUNT_LINKS = [
  { label: "My Profile", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Track Order", href: "/account/orders" },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-white" />
              </div>
              TechGadget
            </Link>
            <p className="text-sm text-gray-400 mb-6 max-w-xs leading-relaxed">
              Your one-stop destination for premium tech gadgets. Genuine products, best prices, and lightning-fast delivery across Pakistan.
            </p>
            {/* Newsletter */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 max-w-xs"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-9 pr-3 h-10 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Get deals &amp; new arrivals in your inbox.
            </p>
          </div>

          {/* Links */}
          <FooterCol title="Shop" links={SHOP_LINKS} />
          <FooterCol title="Account" links={ACCOUNT_LINKS} />
          <div>
            <FooterCol title="Company" links={COMPANY_LINKS} />
            <div className="mt-6">
              <FooterCol title="Support" links={SUPPORT_LINKS} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} TechGadget. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-8 h-5 bg-gray-700 rounded text-[10px] font-bold text-gray-300 flex items-center justify-center">VISA</span>
              <span className="inline-block w-8 h-5 bg-gray-700 rounded text-[10px] font-bold text-gray-300 flex items-center justify-center">MC</span>
              <span className="inline-block px-2 h-5 bg-gray-700 rounded text-[10px] font-bold text-sky-400 flex items-center justify-center">stripe</span>
            </span>
            <span>Secure payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
