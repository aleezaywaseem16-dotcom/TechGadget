"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { url: string; alt: string | null }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const allImages = images.length > 0
    ? images
    : [{ url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop", alt: productName }];

  const [active, setActive]       = useState(0);
  const [lightbox, setLightbox]   = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + allImages.length) % allImages.length), [allImages.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % allImages.length), [allImages.length]);

  // Keyboard navigation + close on Escape
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightbox(false);
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [lightbox, prev, next]);

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative w-full aspect-[3/4] max-h-[480px] bg-muted rounded-2xl overflow-hidden group">
          <Image
            src={allImages[active].url}
            alt={allImages[active].alt ?? productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Fullscreen button */}
          <button
            onClick={() => setLightbox(true)}
            aria-label="View fullscreen"
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
          >
            <Expand className="w-4 h-4" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full shadow flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 dark:bg-gray-800/90 rounded-full shadow flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Image counter */}
          {allImages.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              {active + 1} / {allImages.length}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                  i === active
                    ? "border-primary"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? productName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          {allImages.length > 1 && (
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {active + 1} / {allImages.length}
            </span>
          )}

          {/* Prev */}
          {allImages.length > 1 && (
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main lightbox image */}
          <div
            className="relative w-full h-full max-w-4xl max-h-[85vh] mx-16 my-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[active].url}
              alt={allImages[active].alt ?? productName}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next */}
          {allImages.length > 1 && (
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Backdrop click closes */}
          <div className="absolute inset-0 -z-10" onClick={() => setLightbox(false)} />

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all",
                    i === active ? "border-white" : "border-white/30 opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? productName}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
