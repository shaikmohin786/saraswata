"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SliderSlide } from "@/lib/db/queries/sliders";

type HeroSliderProps = {
  slides: Array<SliderSlide & { imageUrl: string }>;
  siteName: string;
};

const ease = [0.4, 0, 0.2, 1] as const;
const AUTOPLAY_MS = 7000;

export function HeroSlider({ slides, siteName }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);

  const hasSlides = slides.length > 0;
  const multiple = slides.length > 1;

  const goTo = useCallback(
    (i: number) => setIndex((i + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (!multiple) return;
    const timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [multiple, index, goTo]);

  useEffect(() => {
    if (!multiple) return;
    setSlideProgress(0);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / AUTOPLAY_MS, 1);
      setSlideProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, multiple]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallaxY = Math.min(scrollY * 0.2, 80);

  return (
    <section
      className="relative -mt-[var(--header-h-hero)] w-full max-w-[100vw] overflow-hidden bg-primary-dark"
      aria-label="Featured gallery"
    >
      <div className="relative min-h-[min(92svh,56rem)] w-full">
        {/* Crossfade slides — image only, no overlays */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translateY(${parallaxY}px)` }}
        >
          {hasSlides ? (
            slides.map((slide, i) => (
              <motion.div
                key={`${slide.imageUrl}-${i}`}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: i === index ? 1 : 0,
                  scale: i === index ? 1 : 1.02,
                }}
                transition={{ duration: 1.2, ease }}
                style={{ zIndex: i === index ? 2 : 1 }}
                aria-hidden={i !== index}
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.text || siteName}
                  fill
                  priority={i === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </motion.div>
            ))
          ) : (
            <div className="absolute inset-0 bg-hero-gradient" />
          )}
        </div>

        {/* Minimal controls — small corner cluster, never blocks centre */}
        {multiple && (
          <>
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 sm:bottom-6 sm:right-6">
              <span className="rounded-full bg-white/80 px-2.5 py-1 font-mono text-[10px] tabular-nums tracking-wider text-primary/60 backdrop-blur-md">
                {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-primary/70 backdrop-blur-md transition-colors hover:bg-white hover:text-primary"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-primary/70 backdrop-blur-md transition-colors hover:bg-white hover:text-primary"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 h-[2px] bg-black/10">
              <div
                className="h-full bg-accent transition-[width] duration-100 ease-linear"
                style={{ width: `${slideProgress * 100}%` }}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
