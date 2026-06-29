"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProductCardImageProps {
  images: { url: string; alt: string | null }[];
  productName: string;
  fallback: string;
}

export function ProductCardImage({ images, productName, fallback }: ProductCardImageProps) {
  const all    = images.length > 0 ? images : [{ url: fallback, alt: productName }];
  const multi  = all.length > 1;

  const [idx,   setIdx]   = useState(0);
  const [fade,  setFade]  = useState(false);
  const [hover, setHover] = useState(false);
  const [err,   setErr]   = useState(false);

  const slideTimer  = useRef<ReturnType<typeof setInterval>  | null>(null);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout>   | null>(null);

  function clearAll() {
    if (slideTimer.current)  clearInterval(slideTimer.current);
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    slideTimer.current = fadeTimeout.current = null;
  }

  function crossfadeTo(next: number) {
    if (fadeTimeout.current) { clearTimeout(fadeTimeout.current); fadeTimeout.current = null; }
    setFade(true);
    fadeTimeout.current = setTimeout(() => {
      setIdx(next);
      setFade(false);
      fadeTimeout.current = null;
    }, 200);
  }

  function enter() {
    clearAll();
    setHover(true);
    setFade(false);
    if (!multi) return;
    let n = 0;
    slideTimer.current = setInterval(() => {
      n = (n + 1) % all.length;
      crossfadeTo(n);
    }, 800);
  }

  function leave() {
    clearAll();
    setHover(false);
    crossfadeTo(0);
  }

  useEffect(() => () => clearAll(), []);

  const src = err ? fallback : all[idx].url;
  const alt = all[idx].alt ?? productName;

  return (
    // Outer: clips zoom overflow
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* Scale wrapper — only this div zooms, keeping dots outside the zoom */}
      <div
        className={[
          "absolute inset-0 transition-transform duration-500 ease-out",
          !multi && hover ? "scale-[1.12]" : "scale-100",
        ].join(" ")}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={[
            "object-cover transition-opacity duration-200 ease-in-out",
            fade ? "opacity-0" : "opacity-100",
          ].join(" ")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setErr(true)}
        />
      </div>

      {/* Dot indicators — outside scale wrapper so they don't zoom with the image */}
      {multi && hover && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
          {all.map((_, i) => (
            <span
              key={i}
              className={[
                "block rounded-full shadow transition-all duration-200",
                i === idx ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
