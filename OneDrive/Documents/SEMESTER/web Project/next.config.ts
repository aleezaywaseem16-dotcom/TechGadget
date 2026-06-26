import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      // OnePlus
      { protocol: "https", hostname: "oasis.opstatics.com" },
      // Xiaomi
      { protocol: "https", hostname: "i01.appmifile.com" },
      // HP
      { protocol: "https", hostname: "ssl-product-images.www8-hp.com" },
      // Lenovo
      { protocol: "https", hostname: "www.lenovo.com" },
      // JBL
      { protocol: "https", hostname: "consumer.jbl.global" },
      // Garmin
      { protocol: "https", hostname: "static.garmin.com" },
      // SteelSeries
      { protocol: "https", hostname: "media.steelseries.com" },
      // Anker
      { protocol: "https", hostname: "dimg.anker.com" },
      // DJI
      { protocol: "https", hostname: "store-cdn.dji.com" },
    ],
  },
};

export default nextConfig;
