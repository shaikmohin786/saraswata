"use client";

import Link from "next/link";
import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ArrowRight, BookOpen, Feather, Library, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/public/shared/FadeIn";

const CHAPTERS = [
  {
    id: "foundation",
    chapter: "01",
    year: "1918",
    era: "The Beginning",
    title: "Foundation",
    narrative:
      "Sri V.V. Subroya Shreshty opens a modest reading room in Vetapalem — planting the seed of what would become one of India's great private heritage libraries.",
    highlight: "Vetapalem, Andhra Pradesh",
    stat: { value: "1918", label: "Year established" },
    icon: BookOpen,
  },
  {
    id: "gandhian",
    chapter: "02",
    year: "1920s",
    era: "Freedom & Thought",
    title: "Gandhian Connection",
    narrative:
      "The library grows into a hub for Gandhian literature and nationalist discourse — a quiet refuge for readers, thinkers and freedom-era scholars.",
    highlight: "Gandhian literature & nationalist thought",
    stat: { value: "100+", label: "Years of service" },
    icon: Feather,
  },
  {
    id: "collections",
    chapter: "03",
    year: "1950s",
    era: "Rare Treasures",
    title: "Rare Collections",
    narrative:
      "Holdings expand to include palm-leaf manuscripts, historic editions and scholarly works — manuscripts that tell the story of a civilisation in ink and leaf.",
    highlight: "Palm-leaf manuscripts & historic texts",
    stat: { value: "10K+", label: "Rare volumes" },
    icon: Library,
  },
  {
    id: "today",
    chapter: "04",
    year: "Today",
    era: "Living Heritage",
    title: "A Century Lives On",
    narrative:
      "Saraswata Niketanam continues to welcome scholars, students and visitors — preserving knowledge while honouring the Gandhian spirit for new generations.",
    highlight: "Open to scholars, readers & the community",
    stat: { value: "100", label: "Years celebrated" },
    icon: Sparkles,
  },
] as const;

const AUTOPLAY_MS = 5500;
const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring" as const, stiffness: 320, damping: 30 };
const SWIPE_THRESHOLD = 60;

const panelVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -32 : 32,
    position: "absolute" as const,
    inset: 0,
  }),
};

const staggerContainer = {
  center: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const staggerItem = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.38, ease } },
};

export function LegacyTimeline() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(true);
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-120, 0, 120], [0.72, 1, 0.72]);
  const sectionRef = useRef<HTMLElement>(null);
  const pauseLock = useRef(0);
  const reduceMotion = useReducedMotion();

  const isPaused = paused || !inView || !!reduceMotion;

  const holdAutoplay = useCallback(() => {
    pauseLock.current += 1;
    setPaused(true);
  }, []);

  const releaseAutoplay = useCallback(() => {
    pauseLock.current = Math.max(0, pauseLock.current - 1);
    setPaused(pauseLock.current > 0);
  }, []);

  const goTo = useCallback((targetIndex: number) => {
    setActive((prev) => {
      const next = (targetIndex + CHAPTERS.length) % CHAPTERS.length;
      if (next === prev) return prev;
      const forward = (prev + 1) % CHAPTERS.length === next;
      const backward = (prev - 1 + CHAPTERS.length) % CHAPTERS.length === next;
      setDirection(forward ? 1 : backward ? -1 : next > prev ? 1 : -1);
      return next;
    });
  }, []);

  const pauseOnChapter = useCallback(
    (index: number) => {
      goTo(index);
      holdAutoplay();
    },
    [goTo, holdAutoplay]
  );

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
    const timer = setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [active, isPaused, goTo]);

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
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(active + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(active - 1);
    animate(dragX, 0, { duration: 0.3, ease });
  };

  const slideTransition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.55, ease };

  const current = CHAPTERS[active];
  const Icon = current.icon;

  return (
    <section
      id="home-legacy"
      ref={sectionRef}
      className="scroll-mt-[var(--header-h)] overflow-hidden bg-warm-gradient py-6 md:py-8"
      aria-label="Our legacy timeline"
    >
      <div className="site-container">
        <FadeIn>
          <div className="mx-auto mb-4 max-w-xl text-center lg:mb-5">
            <p className="section-label mb-1.5">Our Legacy</p>
            <h2 className="heading-section text-primary">A Century of Preservation</h2>
            <div className="mx-auto mt-2.5 accent-line" />
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Hover a chapter to pause · auto-advances through four eras
            </p>
          </div>
        </FadeIn>

        {/* Heritage chronicle panel */}
        <FadeIn delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-lg shadow-primary/5 lg:max-h-[calc(100svh-var(--header-h)-11.5rem)]">
            {/* Decorative watermark — drifts on chapter change */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 24, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -16, scale: 1.02 }}
                transition={{ duration: 0.7, ease }}
                className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-serif text-[clamp(7rem,18vw,12rem)] font-bold leading-none text-primary/[0.04]"
                aria-hidden
              >
                {current.year}
              </motion.div>
            </AnimatePresence>

            {/* Progress rail */}
            <div className="absolute inset-x-0 top-0 z-10 h-0.5 bg-secondary">
              <motion.div
                className="relative h-full bg-accent"
                style={{ width: `${progress * 100}%` }}
              >
                <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_rgba(219,168,41,0.55)]" />
              </motion.div>
            </div>

            <div className="relative grid lg:max-h-[inherit] lg:grid-cols-[minmax(0,11.5rem)_1fr]">
              {/* Vertical spine — desktop */}
              <nav
                className="hidden border-r border-[var(--border)] bg-secondary/30 p-4 lg:block lg:py-5"
                aria-label="Timeline chapters"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                    Chapters
                  </p>
                  {!isPaused && (
                    <span className="flex items-center gap-1 text-[9px] text-muted">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                      Auto
                    </span>
                  )}
                </div>
                <ol className="relative space-y-1">
                  <div
                    className="absolute bottom-4 left-[11px] top-4 w-px bg-[var(--border)]"
                    aria-hidden
                  />
                  <motion.div
                    layout
                    className="absolute left-[11px] w-px origin-top bg-accent"
                    animate={{
                      top: `${12 + active * 58}px`,
                      height: 40,
                    }}
                    transition={reduceMotion ? { duration: 0.2 } : spring}
                    aria-hidden
                  />
                  {CHAPTERS.map((ch, i) => {
                    const isActive = i === active;
                    return (
                      <li key={ch.id} className="relative">
                        {isActive && (
                          <motion.span
                            layoutId="legacy-spine-highlight"
                            className="absolute inset-0 rounded-lg bg-white/80 shadow-sm shadow-primary/5"
                            transition={reduceMotion ? { duration: 0.2 } : spring}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          onMouseEnter={() => pauseOnChapter(i)}
                          onMouseLeave={releaseAutoplay}
                          onFocus={() => pauseOnChapter(i)}
                          onBlur={releaseAutoplay}
                          aria-current={isActive ? "step" : undefined}
                          className={cn(
                            "group relative z-10 flex w-full items-start gap-3 rounded-lg py-2 pl-1 pr-2 text-left transition-colors",
                            !isActive && "hover:bg-white/60"
                          )}
                        >
                          <span className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                            {isActive && (
                              <motion.span
                                layoutId="legacy-spine-dot"
                                className="absolute inset-0 rounded-full border-2 border-accent bg-accent shadow-sm shadow-accent/30"
                                transition={reduceMotion ? { duration: 0.2 } : spring}
                              />
                            )}
                            <span
                              className={cn(
                                "absolute inset-0 rounded-full border-2 bg-white transition-colors duration-300",
                                isActive
                                  ? "border-transparent opacity-0"
                                  : "border-[var(--border)] group-hover:border-primary/30"
                              )}
                            />
                          </span>
                          <span className="min-w-0 pt-0.5">
                            <span
                              className={`block font-serif text-sm font-bold transition-colors ${
                                isActive ? "text-primary" : "text-primary/40 group-hover:text-primary/65"
                              }`}
                            >
                              {ch.year}
                            </span>
                            <span
                              className={`mt-0.5 block text-[10px] uppercase tracking-wider transition-colors ${
                                isActive ? "text-muted" : "text-primary/30"
                              }`}
                            >
                              {ch.era}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* Main stage — swipeable */}
              <motion.div
                className="relative min-h-[18.75rem] touch-pan-y sm:min-h-[17.5rem] lg:min-h-0 lg:max-h-[inherit]"
                style={{ opacity: dragOpacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={onDragEnd}
                onDrag={(_, info) => dragX.set(info.offset.x)}
              >
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={current.id}
                    custom={direction}
                    variants={reduceMotion ? undefined : panelVariants}
                    initial={reduceMotion ? { opacity: 0 } : "enter"}
                    animate={reduceMotion ? { opacity: 1 } : "center"}
                    exit={reduceMotion ? { opacity: 0 } : "exit"}
                    transition={slideTransition}
                    className="relative flex h-full flex-col p-4 sm:p-5 lg:py-5 lg:pl-6 lg:pr-8"
                  >
                    {/* Mobile chapter pills */}
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
                      {CHAPTERS.map((ch, i) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => goTo(i)}
                          onMouseEnter={() => pauseOnChapter(i)}
                          onMouseLeave={releaseAutoplay}
                          onFocus={() => pauseOnChapter(i)}
                          onBlur={releaseAutoplay}
                          className={`relative shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                            i === active
                              ? "text-primary-dark"
                              : "border border-[var(--border)] bg-white text-primary/45 hover:border-accent/30 hover:text-primary"
                          }`}
                        >
                          {i === active && (
                            <motion.span
                              layoutId="legacy-mobile-pill"
                              className="absolute inset-0 rounded-full bg-accent"
                              transition={reduceMotion ? { duration: 0.2 } : spring}
                            />
                          )}
                          <span className="relative z-10">{ch.year}</span>
                        </button>
                      ))}
                    </div>

                    <motion.div
                      className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:gap-6"
                      variants={reduceMotion ? undefined : staggerContainer}
                      initial="enter"
                      animate="center"
                    >
                      {/* Year column */}
                      <div className="relative shrink-0 lg:w-[34%]">
                        <motion.p
                          variants={reduceMotion ? undefined : staggerItem}
                          className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted"
                        >
                          Chapter {current.chapter} · {current.era}
                        </motion.p>
                        <motion.div variants={reduceMotion ? undefined : staggerItem} className="relative mt-2">
                          <motion.span
                            key={current.year}
                            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease }}
                            className="inline-block font-serif text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-none text-accent"
                          >
                            {current.year}
                          </motion.span>
                        </motion.div>
                        <motion.div
                          variants={reduceMotion ? undefined : staggerItem}
                          className="mt-2 h-0.5 origin-left bg-accent/60"
                          initial={reduceMotion ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.45, ease, delay: 0.08 }}
                        />
                        <motion.div
                          variants={reduceMotion ? undefined : staggerItem}
                          className="mt-3 inline-flex items-center gap-2.5 rounded-lg border border-[var(--border)] bg-secondary/50 px-3 py-2"
                        >
                          <motion.div
                            key={current.id}
                            initial={reduceMotion ? false : { rotate: -12, scale: 0.85, opacity: 0 }}
                            animate={{ rotate: 0, scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease }}
                          >
                            <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                          </motion.div>
                          <div>
                            <p className="font-serif text-base font-semibold text-primary">
                              {current.stat.value}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-muted">
                              {current.stat.label}
                            </p>
                          </div>
                        </motion.div>
                      </div>

                      {/* Narrative */}
                      <div className="min-w-0 flex-1">
                        <motion.h3
                          variants={reduceMotion ? undefined : staggerItem}
                          className="font-serif text-lg font-semibold text-primary sm:text-xl"
                        >
                          {current.title}
                        </motion.h3>
                        <motion.p
                          variants={reduceMotion ? undefined : staggerItem}
                          className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted"
                        >
                          {current.narrative}
                        </motion.p>
                        <motion.p
                          variants={reduceMotion ? undefined : staggerItem}
                          className="mt-2 inline-block rounded-full border border-[var(--border)] bg-secondary/60 px-2.5 py-0.5 text-[10px] font-medium text-primary/70"
                        >
                          {current.highlight}
                        </motion.p>

                        {/* Dot nav + hint */}
                        <motion.div
                          variants={reduceMotion ? undefined : staggerItem}
                          className="mt-4 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            {CHAPTERS.map((ch, i) => (
                              <button
                                key={ch.id}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Go to ${ch.year}`}
                                className="relative flex h-8 w-8 items-center justify-center"
                              >
                                {i === active && (
                                  <motion.span
                                    layoutId="legacy-dot-active"
                                    className="absolute h-2.5 w-2.5 rounded-full bg-accent"
                                    transition={reduceMotion ? { duration: 0.2 } : spring}
                                  />
                                )}
                                <span
                                  className={cn(
                                    "rounded-full transition-colors duration-300",
                                    i === active
                                      ? "h-2.5 w-2.5 opacity-0"
                                      : "h-1.5 w-1.5 bg-primary/20 hover:bg-primary/35"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] uppercase tracking-wider text-primary/35">
                            {isPaused ? "Paused · move away to resume" : "Auto-advancing · swipe or use ← →"}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-5 text-center lg:mt-6">
            <HomeSectionLink
              href="/page/history"
              section="legacy"
              className="btn-outline-dark group inline-flex items-center gap-2"
            >
              Explore Full History
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </HomeSectionLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
