"use client";

import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { cn } from "@/lib/utils";
import { useScrollBoundaryNav, scrollBoundaryNavClassName, scrollItemWithinNav } from "@/hooks/useScrollBoundaryNav";

export type VideoPreviewItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  excerpt?: string;
};

const AUTOPLAY_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

function FeaturedVideo({
  item,
  layout = "stacked",
  direction = 1,
}: {
  item: VideoPreviewItem;
  layout?: "stacked" | "desktop";
  direction?: number;
}) {
  const isDesktop = layout === "desktop";
  const reduceMotion = useReducedMotion();

  const slide = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: direction > 0 ? 28 : -28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction > 0 ? -20 : 20 },
      };

  return (
    <HomeSectionLink href={item.href} section="videos" className="group block h-full min-h-0">
      <article className={cn("flex h-full min-h-0 flex-col", !isDesktop && "gap-0")}>
        <div
          className={cn(
            "relative overflow-hidden bg-[#1a1208]",
            isDesktop ? "min-h-0 flex-[1.25]" : "aspect-[16/9] sm:aspect-[2/1]"
          )}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={item.imageUrl ?? item.id}
              custom={direction}
              initial={slide.initial}
              animate={slide.animate}
              exit={slide.exit}
              transition={{ duration: 0.45, ease }}
              className="absolute inset-0"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes={isDesktop ? "55vw" : "(max-width: 1024px) 100vw, 65vw"}
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary/20">
                  <Play className="h-10 w-10 text-white/30" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          <div className="absolute left-0 top-0 flex items-center gap-2 bg-primary px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/95">
              Now Playing
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
              <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
            </span>
          </div>
        </div>

        <div className={cn("relative shrink-0 bg-white", isDesktop ? "pt-4" : "pt-5")}>
          {isDesktop && (
            <div className="absolute inset-x-0 -top-px h-0.5 bg-secondary">
              <motion.div
                className="h-full bg-accent"
                style={{ width: "var(--video-progress, 0%)" }}
              />
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={item.id}
              custom={direction}
              initial={slide.initial}
              animate={slide.animate}
              exit={slide.exit}
              transition={{ duration: 0.35, ease }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-primary/10 pb-3 text-[11px] text-muted">
                <span className="font-bold uppercase tracking-wider text-primary">Archive</span>
                <span className="h-3 w-px bg-[var(--border)]" aria-hidden />
                <span>Documentary &amp; recordings</span>
              </div>

              <h3
                className={cn(
                  "mt-3 font-serif font-bold leading-snug tracking-tight text-primary transition-colors group-hover:text-primary/85",
                  isDesktop
                    ? "line-clamp-2 text-[clamp(1.15rem,1.7vw,1.55rem)]"
                    : "text-[clamp(1.25rem,3vw,1.75rem)]"
                )}
              >
                {item.title}
              </h3>

              {item.excerpt && (
                <p
                  className={cn(
                    "text-foreground/70",
                    isDesktop
                      ? "mt-2 line-clamp-2 text-[13px] leading-relaxed"
                      : "mt-3 text-[15px] leading-[1.75]"
                  )}
                >
                  {item.excerpt}
                </p>
              )}

              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent">
                Watch video
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>
    </HomeSectionLink>
  );
}

function VideoListRow({
  item,
  index,
  active,
  onHover,
  onSelect,
  onItemEnter,
  onItemLeave,
  showDivider,
}: {
  item: VideoPreviewItem;
  index: number;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
  onItemEnter?: () => void;
  onItemLeave?: () => void;
  showDivider?: boolean;
}) {
  return (
    <>
      <button
        type="button"
        data-video-index={index}
        onMouseEnter={() => {
          onHover();
          onItemEnter?.();
        }}
        onMouseLeave={() => onItemLeave?.()}
        onFocus={() => {
          onHover();
          onItemEnter?.();
        }}
        onBlur={() => onItemLeave?.()}
        onClick={onSelect}
        className={cn(
          "relative flex w-full shrink-0 items-center gap-3 py-3 text-left transition-colors duration-200",
          active ? "text-primary" : "text-primary/65 hover:text-primary"
        )}
      >
        <span
          className={cn(
            "absolute bottom-0 left-0 top-0 w-0.5 transition-colors duration-200",
            active ? "bg-accent" : "bg-transparent"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "w-5 shrink-0 font-mono text-[10px] font-medium tabular-nums tracking-tight",
            active ? "text-accent" : "text-muted/70"
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-secondary">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full items-center justify-center bg-primary/10">
              <Play className="h-4 w-4 text-primary/30" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/90 text-primary">
              <Play className="ml-0.5 h-3 w-3 fill-current" />
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "line-clamp-2 text-[13px] leading-snug sm:text-sm",
              active ? "font-semibold" : "font-medium"
            )}
          >
            {item.title}
          </p>
        </div>
      </button>
      {showDivider && <div className="h-px shrink-0 bg-[var(--border)]" aria-hidden />}
    </>
  );
}

export function VideoPreviewSection({
  heading,
  subtitle,
  items,
  viewAllHref,
}: {
  heading: string;
  subtitle?: string;
  items: VideoPreviewItem[];
  viewAllHref: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const pauseLock = useRef(0);
  const skipInitialListScroll = useRef(true);
  const reduceMotion = useReducedMotion();

  const holdAutoplay = useCallback(() => {
    pauseLock.current += 1;
    setPaused(true);
  }, []);

  const releaseAutoplay = useCallback(() => {
    pauseLock.current = Math.max(0, pauseLock.current - 1);
    setPaused(pauseLock.current > 0);
  }, []);

  const activeItem = items[activeIndex] ?? items[0];
  const isPaused = paused || !inView || !!reduceMotion;

  const goTo = useCallback(
    (targetIndex: number) => {
      setActiveIndex((prev) => {
        const next = ((targetIndex % items.length) + items.length) % items.length;
        if (next === prev) return prev;
        const forward = (prev + 1) % items.length === next;
        setDirection(forward ? 1 : -1);
        return next;
      });
    },
    [items.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  useScrollBoundaryNav(desktopNavRef);
  useScrollBoundaryNav(mobileNavRef);

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

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
  }, [activeIndex, isPaused, goNext, items.length]);

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

  useEffect(() => {
    const nav =
      typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
        ? desktopNavRef.current
        : mobileNavRef.current;
    if (!nav) return;

    const row = nav.querySelector<HTMLElement>(`[data-video-index="${activeIndex}"]`);
    if (!row) return;

    if (skipInitialListScroll.current) {
      skipInitialListScroll.current = false;
      return;
    }

    scrollItemWithinNav(nav, row);
  }, [activeIndex]);

  if (items.length === 0 || !activeItem) return null;

  const progressPct = `${progress * 100}%`;

  return (
    <section
      id="home-videos"
      ref={sectionRef}
      className="section-padding scroll-mt-[var(--header-h)] bg-[#faf8f4] lg:py-10 xl:py-12"
      aria-label="Video highlights"
      style={{ "--video-progress": progressPct } as React.CSSProperties}
    >
      <div className="site-container">
        <FadeIn>
          <div className="mb-6 flex flex-col gap-4 lg:mb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px flex-1 max-w-[3rem] bg-accent" aria-hidden />
                  <p className="section-label mb-0">Media</p>
                </div>
                <h2 className="heading-section text-primary">{heading}</h2>
                {subtitle && <p className="mt-1.5 max-w-lg text-sm text-muted">{subtitle}</p>}
              </div>
              <HomeSectionLink
                href={viewAllHref}
                section="videos"
                className="inline-flex shrink-0 items-center gap-1.5 border-b border-transparent text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
              >
                All videos
                <ArrowRight className="h-4 w-4" />
              </HomeSectionLink>
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent/60 to-transparent" />
          </div>
        </FadeIn>

        <div className="hidden max-h-[42rem] min-h-[24rem] gap-0 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-0 min-w-0 pr-6 xl:pr-8">
            <FeaturedVideo item={activeItem} layout="desktop" direction={direction} />
          </div>

          <aside className="flex min-h-0 min-w-0 flex-col border-l border-[var(--border)] pl-6 xl:pl-8">
            <div className="mb-3 shrink-0 border-b-2 border-primary pb-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  Playlist
                </p>
                {!isPaused && items.length > 1 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    Auto
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] text-muted">
                {items.length} videos · hover a title to pause
              </p>
              <div className="mt-2 h-0.5 bg-secondary">
                <motion.div className="h-full bg-accent" style={{ width: progressPct }} />
              </div>
            </div>

            <nav
              ref={desktopNavRef}
              className={cn(
                scrollBoundaryNavClassName,
                "flex min-h-0 flex-1 flex-col"
              )}
              aria-label="Video playlist"
            >
              {items.map((item, i) => (
                <VideoListRow
                  key={item.id}
                  item={item}
                  index={i}
                  active={activeIndex === i}
                  onHover={() => goTo(i)}
                  onSelect={() => goTo(i)}
                  onItemEnter={holdAutoplay}
                  onItemLeave={releaseAutoplay}
                  showDivider={i < items.length - 1}
                />
              ))}
            </nav>
          </aside>
        </div>

        <div className="flex flex-col gap-6 lg:hidden">
          <FeaturedVideo item={activeItem} direction={direction} />
          <div>
            <div className="mb-3 border-b-2 border-primary pb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                More videos
              </p>
              {items.length > 1 && (
                <div className="mt-2 h-0.5 bg-secondary">
                  <motion.div className="h-full bg-accent" style={{ width: progressPct }} />
                </div>
              )}
            </div>
            <nav
              ref={mobileNavRef}
              className={cn(scrollBoundaryNavClassName, "max-h-[20rem]")}
              aria-label="Video playlist"
            >
              {items.map((item, i) => (
                <VideoListRow
                  key={item.id}
                  item={item}
                  index={i}
                  active={activeIndex === i}
                  onHover={() => goTo(i)}
                  onSelect={() => goTo(i)}
                  onItemEnter={holdAutoplay}
                  onItemLeave={releaseAutoplay}
                  showDivider={i < items.length - 1}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
