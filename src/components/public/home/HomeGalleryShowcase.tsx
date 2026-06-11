"use client";

import { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import Image from "next/image";
import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";

export type GalleryShowcaseItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
};

type HomeGalleryShowcaseProps = {
  items: GalleryShowcaseItem[];
  viewAllHref: string;
};

type CarouselSizes = {
  sideW: number;
  activeW: number;
  sideH: number;
  activeH: number;
  gap: number;
};

const AUTOPLAY_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

function middleIndex(count: number) {
  if (count <= 0) return 0;
  return Math.floor((count - 1) / 2);
}

function getSizes(containerWidth: number): CarouselSizes {
  const w = Math.max(containerWidth, 280);
  return {
    sideW: Math.round(Math.min(96, Math.max(40, w * 0.11))),
    activeW: Math.round(Math.min(220, Math.max(100, w * 0.36))),
    sideH: Math.round(Math.min(150, Math.max(68, w * 0.17))),
    activeH: Math.round(Math.min(280, Math.max(120, w * 0.44))),
    gap: Math.round(Math.max(5, Math.min(10, w * 0.018))),
  };
}

function computeOffset(physicalIndex: number, containerWidth: number, sizes: CarouselSizes) {
  let pos = 0;
  for (let i = 0; i < physicalIndex; i++) {
    pos += sizes.sideW + sizes.gap;
  }
  pos += sizes.activeW / 2;
  return containerWidth / 2 - pos;
}

function logicalIndex(physicalIndex: number, count: number) {
  return ((physicalIndex % count) + count) % count;
}

export function HomeGalleryShowcase({ items, viewAllHref }: HomeGalleryShowcaseProps) {
  const count = items.length;
  const extendedItems = useMemo(
    () => (count > 0 ? [...items, ...items, ...items] : []),
    [items, count]
  );

  const [physicalIndex, setPhysicalIndex] = useState(() =>
    count > 0 ? count + middleIndex(count) : 0
  );
  const [direction, setDirection] = useState(1);
  const [trackX, setTrackX] = useState(0);
  const [sizes, setSizes] = useState<CarouselSizes>(() => getSizes(360));
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const [instant, setInstant] = useState(false);
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const jumpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseLock = useRef(0);
  const reduceMotion = useReducedMotion();

  const holdAutoplay = useCallback(() => {
    pauseLock.current += 1;
    setPaused(true);
  }, []);

  const releaseAutoplay = useCallback(() => {
    pauseLock.current = Math.max(0, pauseLock.current - 1);
    setPaused(pauseLock.current > 0);
  }, []);

  const activeIndex = count > 0 ? logicalIndex(physicalIndex, count) : 0;
  const isPaused = paused || !inView || !!reduceMotion || count <= 1;

  const goToPhysical = useCallback(
    (nextPhysical: number, dir: number) => {
      setDirection(dir);
      setPhysicalIndex(nextPhysical);
    },
    []
  );

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    goToPhysical(physicalIndex - 1, -1);
  }, [count, goToPhysical, physicalIndex]);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    goToPhysical(physicalIndex + 1, 1);
  }, [count, goToPhysical, physicalIndex]);

  const selectImage = useCallback(
    (index: number) => {
      if (count <= 1) return;
      const dir = index >= activeIndex ? 1 : -1;
      goToPhysical(count + index, dir);
    },
    [activeIndex, count, goToPhysical]
  );

  const recenter = useCallback(() => {
    const el = containerRef.current;
    if (!el || count === 0) return;
    const w = el.offsetWidth;
    const nextSizes = getSizes(w);
    setSizes(nextSizes);
    setTrackX(computeOffset(physicalIndex, w, nextSizes));
  }, [count, physicalIndex]);

  useLayoutEffect(() => {
    recenter();
  }, [recenter]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => recenter());
    ro.observe(el);
    window.addEventListener("resize", recenter);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recenter);
    };
  }, [recenter]);

  /* Seamless infinite loop — snap back to middle copy after animated step */
  useEffect(() => {
    if (count <= 1) return;

    if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);

    jumpTimerRef.current = setTimeout(() => {
      setPhysicalIndex((p) => {
        if (p >= count * 2) {
          setInstant(true);
          return p - count;
        }
        if (p < count) {
          setInstant(true);
          return p + count;
        }
        return p;
      });
    }, 500);

    return () => {
      if (jumpTimerRef.current) clearTimeout(jumpTimerRef.current);
    };
  }, [physicalIndex, count]);

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  /* Autoplay — same timing pattern as news & legacy */
  useEffect(() => {
    if (isPaused) return;

    setProgress(0);
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / AUTOPLAY_MS, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const timer = setTimeout(goNext, AUTOPLAY_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [physicalIndex, isPaused, goNext]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  if (count === 0) return null;

  const active = items[activeIndex];
  const progressPct = `${progress * 100}%`;
  const trackTransition = instant
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 28 };

  return (
    <section
      id="home-gallery"
      ref={sectionRef}
      className="scroll-mt-[var(--header-h)] w-full max-w-[100vw] overflow-hidden bg-cream py-8 md:py-10"
      aria-label="Photo gallery"
    >
      <div className="site-container">
        <FadeIn>
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="section-label mb-2">Visual Archives</p>
              <h2 className="heading-section text-primary">Photo Gallery</h2>
              <p className="mt-1.5 max-w-md text-sm text-muted">
                All {count} photographs loop — centre image highlighted.
              </p>
            </div>
            <HomeSectionLink href={viewAllHref} section="gallery" className="btn-outline-dark shrink-0 self-start sm:self-auto">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </HomeSectionLink>
          </div>
        </FadeIn>

        <div
          className="relative w-full"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) diff > 0 ? goNext() : goPrev();
          }}
        >
          {count > 1 && (
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-0 sm:px-1">
              <button
                type="button"
                onClick={goPrev}
                className="pointer-events-auto border border-[var(--border)] bg-white p-2 text-primary shadow-md transition-all hover:border-accent hover:text-accent sm:p-2.5"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="pointer-events-auto border border-[var(--border)] bg-white p-2 text-primary shadow-md transition-all hover:border-accent hover:text-accent sm:p-2.5"
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          )}

          <div
            ref={containerRef}
            className="relative w-full overflow-hidden rounded-sm"
            style={{ height: sizes.activeH + 16 }}
          >
            {/* Progress rail — like legacy timeline */}
            {count > 1 && (
              <div className="absolute inset-x-0 top-0 z-20 h-0.5 bg-secondary">
                <motion.div
                  className="relative h-full bg-accent"
                  style={{ width: progressPct }}
                >
                  <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(219,168,41,0.55)]" />
                </motion.div>
              </div>
            )}

            <div
              className="pointer-events-none absolute bottom-3 top-1 z-20 w-px bg-accent/30 sm:bottom-4"
              style={{ left: "50%" }}
              aria-hidden
            />

            <motion.div
              className="absolute bottom-2 left-0 flex items-end sm:bottom-2.5"
              animate={{ x: trackX }}
              transition={trackTransition}
              style={{ gap: sizes.gap }}
            >
              {extendedItems.map((item, i) => {
                const isActive = i === physicalIndex;
                const distance = Math.abs(i - physicalIndex);

                return (
                  <motion.button
                    key={`${item.id}-${i}`}
                    type="button"
                    onClick={() => selectImage(logicalIndex(i, count))}
                    onMouseEnter={holdAutoplay}
                    onMouseLeave={releaseAutoplay}
                    onFocus={holdAutoplay}
                    onBlur={releaseAutoplay}
                    animate={{
                      width: isActive ? sizes.activeW : sizes.sideW,
                      height: isActive ? sizes.activeH : sizes.sideH,
                      opacity: isActive ? 1 : Math.max(0.2, 0.45 - distance * 0.06),
                      scale: isActive ? 1 : Math.max(0.88, 1 - distance * 0.04),
                    }}
                    transition={instant ? { duration: 0 } : trackTransition}
                    className={`relative shrink-0 overflow-hidden rounded-sm bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive ? "z-10 ring-2 ring-accent/80 shadow-lg shadow-primary/15" : ""
                    }`}
                    aria-label={item.title}
                    aria-pressed={isActive}
                    aria-hidden={!isActive && distance > 3}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className={`object-cover transition-all duration-500 ${isActive ? "grayscale-0" : "grayscale-[40%]"}`}
                        sizes={`(max-width:640px) ${sizes.activeW}px, ${sizes.activeW}px`}
                        priority={distance <= 2}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary/20">◈</div>
                    )}

                    {!isActive && distance === 1 && sizes.sideW >= 70 && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/90 text-primary shadow-md sm:h-8 sm:w-8">
                          {i < physicalIndex ? (
                            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          )}
                        </span>
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -16 : 16 }}
              transition={{ duration: 0.35, ease }}
              className="mx-auto mt-2 max-w-xl px-2 text-center sm:px-4"
            >
              <h3 className="break-words font-serif text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                {active.title}
              </h3>
              <HomeSectionLink
                href={active.href}
                section="gallery"
                className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-accent transition-colors hover:text-primary"
              >
                View Photo <ArrowRight className="h-3.5 w-3.5" />
              </HomeSectionLink>
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <div className="mx-auto mt-2 max-w-xs">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>
                  {activeIndex + 1} of {count}
                </span>
                {!isPaused && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    Auto · loops
                  </span>
                )}
              </div>
              <div className="mt-2 h-0.5 bg-secondary lg:hidden">
                <motion.div className="h-full bg-accent" style={{ width: progressPct }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
