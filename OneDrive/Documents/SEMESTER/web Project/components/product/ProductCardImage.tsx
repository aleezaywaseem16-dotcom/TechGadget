"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProductCardImageProps {
  images: { url: string; alt: string | null }[];
  productName: string;
  fallback: string;
}

export function ProductCardImage({ images, productName, fallback }: ProductCardImageProps) {
  const all = images.length > 0 ? images : [{ url: fallback, alt: productName }];
  const multi = all.length > 1;

  const [idx, setIdx]       = useState(0);
  const [fade, setFade]     = useState(false);
  const [hover, setHover]   = useState(false);
  const [err, setErr]       = useState(false);
  const slideTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearAll() {
    if (slideTimer.current)  { clearInterval(slideTimer.current);   slideTimer.current  = null; }
    if (fadeTimeout.current) { clearTimeout(fadeTimeout.current);   fadeTimeout.current = null; }
  }

  function goTo(next: number) {
    // cancel any in-progress fade before starting a new one
    if (fadeTimeout.current) { clearTimeout(fadeTimeout.current); fadeTimeout.current = null; }
    setFade(true);
    fadeTimeout.current = setTimeout(() => {
      setIdx(next);
      setFade(false);
      fadeTimeout.current = null;
    }, 180);
  }

  function enter() {
    clearAll();
    setHover(true);
    setFade(false); // ensure visible immediately on re-enter
    if (!multi) return;
    let n = 0;
    slideTimer.current = setInterval(() => {
      n = (n + 1) % all.length;
      goTo(n);
    }, 900);
  }

  function leave() {
    clearAll();
    setHover(false);
    goTo(0); // fade back to first image
  }

  useEffect(() => () => clearAll(), []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <Image
        src={err ? fallback : all[idx].url}
        alt={all[idx].alt ?? productName}
        fill
        className={[
          "object-cover",
          "transition-all duration-200 ease-in-out",
          fade              ? "opacity-0"   : "opacity-100",
          !multi && hover   ? "scale-110"   : "scale-100",
        ].join(" ")}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onError={() => setErr(true)}
      />

      {/* Dot indicators — visible while hovering multi-image products */}
      {multi && hover && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {all.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 shadow ${
                i === idx ? "w-3 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
