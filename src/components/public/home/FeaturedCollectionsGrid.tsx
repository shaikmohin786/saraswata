"use client";

import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Landmark, Library } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { cn } from "@/lib/utils";

const COLLECTIONS = [
  {
    id: "books",
    num: "01",
    title: "Rare Books & Manuscripts",
    desc: "Palm-leaf texts, historic editions and scholarly works spanning centuries.",
    href: "/page/collection-of-books",
    icon: BookOpen,
  },
  {
    id: "gandhi",
    num: "02",
    title: "Gandhian Literature",
    desc: "Original writings, correspondence and publications connected to Mahatma Gandhi.",
    href: "/page/about-us",
    icon: Library,
  },
  {
    id: "press",
    num: "03",
    title: "Press & Media Archives",
    desc: "Documented coverage of our institution across national and regional media.",
    href: "/posts/presscoverages",
    icon: Landmark,
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function CollectionTile({
  item,
  index,
  active,
  onActivate,
}: {
  item: (typeof COLLECTIONS)[number];
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = item.icon;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07, ease }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300",
        active
          ? "border-accent/45 shadow-md shadow-primary/8 md:flex-[1.35]"
          : "border-[var(--border)] shadow-sm hover:border-primary/15 md:flex-[0.85]"
      )}
    >
      {/* Gold top accent when active */}
      <motion.div
        className="absolute inset-x-0 top-0 h-0.5 bg-accent"
        initial={false}
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.35, ease }}
        style={{ originX: 0 }}
      />

      <div className="relative flex h-full flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300",
              active ? "bg-accent/15 text-primary" : "bg-secondary text-primary/70"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <span className="font-mono text-[10px] tabular-nums tracking-widest text-primary/20">
            {item.num}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-base font-semibold leading-snug text-primary sm:text-[17px]">
          {item.title}
        </h3>

        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              key="body"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease }}
              className="overflow-hidden"
            >
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{item.desc}</p>
              <HomeSectionLink
                href={item.href}
                section="collections"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary transition-colors hover:text-accent"
              >
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </HomeSectionLink>
            </motion.div>
          )}
        </AnimatePresence>

        {!active && (
          <p className="mt-auto pt-3 text-[10px] uppercase tracking-wider text-primary/30">
            <span className="hidden md:inline">Hover to read</span>
            <span className="md:hidden">Tap to read</span>
          </p>
        )}

        {!active && (
          <button
            type="button"
            className="absolute inset-0 z-10 md:hidden"
            onClick={onActivate}
            aria-label={`Open ${item.title}`}
          />
        )}
      </div>
    </motion.article>
  );
}

export function FeaturedCollectionsGrid() {
  const [activeId, setActiveId] = useState<string>(COLLECTIONS[0].id);

  return (
    <section id="home-collections" className="section-padding scroll-mt-[var(--header-h)] bg-section-alt">
      <div className="site-container">
        <FadeIn>
          <div className="mb-7 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="section-label mb-2">Collections</p>
              <h2 className="heading-section text-primary">Featured Collections</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Treasured holdings that define our institution&apos;s scholarly mission.
              </p>
            </div>
            <HomeSectionLink href="/page/collection-of-books" section="collections" className="btn-outline-dark shrink-0 text-sm">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </HomeSectionLink>
          </div>
        </FadeIn>

        {/* Desktop: expanding spotlight row */}
        <div
          className="hidden gap-3 md:flex"
          onMouseLeave={() => setActiveId(COLLECTIONS[0].id)}
        >
          {COLLECTIONS.map((item, i) => (
            <CollectionTile
              key={item.id}
              item={item}
              index={i}
              active={activeId === item.id}
              onActivate={() => setActiveId(item.id)}
            />
          ))}
        </div>

        {/* Mobile: compact accordion stack */}
        <div className="flex flex-col gap-2.5 md:hidden">
          {COLLECTIONS.map((item, i) => (
            <CollectionTile
              key={item.id}
              item={item}
              index={i}
              active={activeId === item.id}
              onActivate={() => setActiveId(activeId === item.id ? "" : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
