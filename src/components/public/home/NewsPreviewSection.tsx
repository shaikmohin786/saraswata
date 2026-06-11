"use client";

import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { cn } from "@/lib/utils";
import { useScrollBoundaryNav, scrollBoundaryNavClassName, scrollItemWithinNav } from "@/hooks/useScrollBoundaryNav";

export type NewsPreviewItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  excerpt?: string;
  date?: string;
};

const AUTOPLAY_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function readMinutes(excerpt?: string, title?: string) {
  const words = `${title ?? ""} ${excerpt ?? ""}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
}

function LeadStory({
  item,
  layout = "stacked",
  direction = 1,
}: {
  item: NewsPreviewItem;
  layout?: "stacked" | "desktop";
  direction?: number;
}) {
  const minutes = readMinutes(item.excerpt, item.title);
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
    <HomeSectionLink href={item.href} section="news" className="group block h-full min-h-0">
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
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes={isDesktop ? "55vw" : "(max-width: 1024px) 100vw, 65vw"}
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-primary/10">
                  <span className="font-serif text-4xl text-white/20">§</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute left-0 top-0 flex items-center gap-2 bg-primary px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/95">
              Featured
            </span>
          </div>
        </div>

        <div className={cn("relative shrink-0 bg-white", isDesktop ? "pt-4" : "pt-5")}>
          {isDesktop && (
            <div className="absolute inset-x-0 -top-px h-0.5 bg-secondary">
              <motion.div
                className="h-full bg-accent"
                style={{ width: "var(--news-progress, 0%)" }}
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
                <span className="font-bold uppercase tracking-wider text-primary">Press</span>
                <span className="h-3 w-px bg-[var(--border)]" aria-hidden />
                {item.date && <time>{formatDate(item.date)}</time>}
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {minutes} min
                </span>
              </div>

              <h3
                className={cn(
                  "font-serif font-bold leading-[1.2] tracking-tight text-primary transition-colors group-hover:text-primary/80",
                  isDesktop
                    ? "mt-3 line-clamp-2 text-[clamp(1.15rem,1.7vw,1.55rem)]"
                    : "mt-4 text-[clamp(1.35rem,3vw,1.85rem)]"
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
                      : "article-lede mt-3 text-[15px] leading-[1.75]"
                  )}
                >
                  {item.excerpt}
                </p>
              )}

              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover:text-accent">
                Read full story
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </article>
    </HomeSectionLink>
  );
}

function HeadlineRow({
  item,
  index,
  active,
  onHover,
  onSelect,
  onItemEnter,
  onItemLeave,
  showDivider,
}: {
  item: NewsPreviewItem;
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
        data-headline-index={index}
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
            <div className="flex h-full items-center justify-center bg-primary/5 text-[10px] text-primary/20">
              §
            </div>
          )}
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
          {item.date && (
            <time className="mt-1 block text-[10px] uppercase tracking-wide text-muted">
              {formatDate(item.date)}
            </time>
          )}
        </div>
      </button>
      {showDivider && <div className="h-px shrink-0 bg-[var(--border)]" aria-hidden />}
    </>
  );
}

export function NewsPreviewSection({
  heading,
  subtitle,
  items,
  viewAllHref,
}: {
  heading: string;
  subtitle?: string;
  items: NewsPreviewItem[];
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

    const row = nav.querySelector<HTMLElement>(`[data-headline-index="${activeIndex}"]`);
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
      id="home-news"
      ref={sectionRef}
      className="section-padding scroll-mt-[var(--header-h)] bg-white lg:py-10 xl:py-12"
      aria-label="Latest news"
      style={{ "--news-progress": progressPct } as React.CSSProperties}
    >
      <div className="site-container">
        <FadeIn>
          <div className="mb-6 flex flex-col gap-4 lg:mb-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px flex-1 max-w-[3rem] bg-accent" aria-hidden />
                  <p className="section-label mb-0">News & Events</p>
                </div>
                <h2 className="heading-section text-primary">{heading}</h2>
                {subtitle && <p className="mt-1.5 max-w-lg text-sm text-muted">{subtitle}</p>}
              </div>
              <HomeSectionLink
                href={viewAllHref}
                section="news"
                className="inline-flex shrink-0 items-center gap-1.5 border-b border-transparent text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
              >
                View all coverage
                <ArrowRight className="h-4 w-4" />
              </HomeSectionLink>
            </div>
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent/60 to-transparent" />
          </div>
        </FadeIn>

        {/* Desktop: auto-playing lead + scrolling headline rail */}
        <div className="hidden max-h-[42rem] min-h-[24rem] gap-0 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-0 min-w-0 pr-6 xl:pr-8">
            <LeadStory item={activeItem} layout="desktop" direction={direction} />
          </div>

          <aside className="flex min-h-0 min-w-0 flex-col border-l border-[var(--border)] pl-6 xl:pl-8">
            <div className="mb-3 shrink-0 border-b-2 border-primary pb-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  Headlines
                </p>
                {!isPaused && items.length > 1 && (
                  <span className="flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    Auto
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[10px] text-muted">
                {items.length} stories · hover a headline to pause
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
              aria-label="News headlines"
            >
              {items.map((item, i) => (
                <HeadlineRow
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

        {/* Mobile */}
        <div className="flex flex-col gap-6 lg:hidden">
          <LeadStory item={activeItem} direction={direction} />
          <div>
            <div className="mb-3 border-b-2 border-primary pb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                More headlines
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
              aria-label="News headlines"
            >
              {items.map((item, i) => (
                <HeadlineRow
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
