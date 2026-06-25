import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Apple
      { protocol: "https", hostname: "store.storeimages.cdn-apple.com" },
      // Samsung
      { protocol: "https", hostname: "images.samsung.com" },
      // Sony
      { protocol: "https", hostname: "www.sony.com" },
      { protocol: "https", hostname: "sony.scene7.com" },
      // Dell
      { protocol: "https", hostname: "i.dell.com" },
      // ASUS
      { protocol: "https", hostname: "dlcdnwebimgs.asus.com" },
      // Razer
      { protocol: "https", hostname: "assets2.razerzone.com" },
      { protocol: "https", hostname: "hybrismediaprod.blob.core.windows.net" },
      // Logitech
      { protocol: "https", hostname: "resource.logitech.com" },
      // Bose
      { protocol: "https", hostname: "assets.bose.com" },
    ],
  },
};

export default nextConfig;
