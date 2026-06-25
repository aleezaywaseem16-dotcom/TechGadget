import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | TechGadget",
    default: "TechGadget — Premium Tech Store",
  },
  description:
    "Shop the latest smartphones, laptops, gaming gear, smart watches, cameras and more at TechGadget. Best prices, genuine products, fast delivery.",
  keywords: ["tech", "gadgets", "electronics", "smartphones", "laptops", "gaming"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
