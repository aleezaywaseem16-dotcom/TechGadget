"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProductCardImageProps {
  images: { url: string; alt: string | null }[];
  productName: string;
  fallback: string;
}

export function ProductCardImage({ images, productName, fallback }: ProductCardImageProps) {
  const allImages = images.length > 0 ? images : [{ url: fallback, alt: productName }];
  const hasMultiple = allImages.length > 1;

  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading]       = useState(false);
  const [imgError, setImgError]   = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentSrc = imgError ? fallback : (allImages[activeIdx].url);

  const startSlideshow = () => {
    if (!hasMultiple) return;
    intervalRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActiveIdx((i) => (i + 1) % allImages.length);
        setFading(false);
      }, 150);
    }, 700);
  };

  const stopSlideshow = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setFading(true);
    setTimeout(() => {
      setActiveIdx(0);
      setFading(false);
    }, 150);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={startSlideshow}
      onMouseLeave={stopSlideshow}
    >
      <Image
        src={currentSrc}
        alt={allImages[activeIdx].alt ?? productName}
        fill
        className={`object-cover transition-all duration-150 ${
          fading ? "opacity-0 scale-100" : hasMultiple ? "opacity-100 scale-100" : "opacity-100 group-hover:scale-105 duration-500"
        }`}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onError={() => setImgError(true)}
      />

      {/* Dot indicators — only when multiple images */}
      {hasMultiple && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {allImages.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 ${
                i === activeIdx ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
