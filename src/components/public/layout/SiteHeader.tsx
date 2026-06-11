"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/db/get-public-layout-data";

type SiteHeaderProps = {
  siteName: string;
  logoUrl: string | null;
  menu: NavItem[];
};

const SCROLL_RANGE = 140;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixRgba(
  from: [number, number, number, number],
  to: [number, number, number, number],
  t: number
) {
  return `rgba(${Math.round(lerp(from[0], to[0], t))}, ${Math.round(lerp(from[1], to[1], t))}, ${Math.round(lerp(from[2], to[2], t))}, ${lerp(from[3], to[3], t).toFixed(3)})`;
}

/** Shorter labels so nav never wraps */
const LABEL: Record<string, string> = {
  PressCoverages: "Press",
  "Support us": "Support",
  "Contact Us": "Contact",
  "About us": "About",
};

function displayTitle(title: string) {
  return LABEL[title] ?? title;
}

function isActive(href: string, pathname: string) {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function isParentActive(item: NavItem, pathname: string) {
  if (item.href !== "#" && isActive(item.href, pathname)) return true;
  return item.children.some((c) => c.href !== "#" && isActive(c.href, pathname));
}

function desktopMenu(items: NavItem[]) {
  return items.filter(
    (item) =>
      item.href !== "/page/contact-us" &&
      !item.title.toLowerCase().includes("contact us")
  );
}

function NavLink({
  href,
  label,
  active,
  overHero,
}: {
  href: string;
  label: string;
  active: boolean;
  overHero: boolean;
}) {
  return (
    <Link
      href={href}
      data-cursor-hover
      className={cn(
        "group relative rounded-md px-3 py-2 transition-all duration-200",
        overHero ? "hover:bg-white/12" : "hover:bg-primary/[0.07]"
      )}
    >
      <span
        className={cn(
          "whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200",
          overHero
            ? active
              ? "text-white group-hover:text-[var(--accent-light)]"
              : "text-white/75 group-hover:text-[var(--accent-light)]"
            : active
              ? "text-primary group-hover:text-accent"
              : "text-primary/55 group-hover:text-primary"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "absolute bottom-0.5 left-3 right-3 h-px origin-center transition-transform duration-300",
          overHero ? "bg-[var(--accent-light)]" : "bg-accent",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}

function DesktopDropdown({
  item,
  pathname,
  overHero,
}: {
  item: NavItem;
  pathname: string;
  overHero: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = isParentActive(item, pathname);
  const children = item.children.filter((child) => child.href !== "#");

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        data-cursor-hover
        className={cn(
          "group relative flex items-center gap-1 rounded-md px-3 py-2 transition-all duration-200",
          overHero ? "hover:bg-white/12" : "hover:bg-primary/[0.07]"
        )}
        aria-expanded={open}
      >
        <span
          className={cn(
            "whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200",
            overHero
              ? active || open
                ? "text-[var(--accent-light)]"
                : "text-white/75 group-hover:text-[var(--accent-light)]"
              : active || open
                ? "text-accent"
                : "text-primary/55 group-hover:text-primary"
          )}
        >
          {displayTitle(item.title)}
        </span>
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-[color,transform] duration-200",
            overHero
              ? active || open
                ? "text-[var(--accent-light)]"
                : "text-white/55 group-hover:text-[var(--accent-light)]"
              : active || open
                ? "text-accent"
                : "text-primary/40 group-hover:text-accent",
            open && "rotate-180"
          )}
        />
        <span
          className={cn(
            "absolute bottom-0.5 left-3 right-3 h-px origin-center transition-transform duration-300",
            overHero ? "bg-[var(--accent-light)]" : "bg-accent",
            active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          )}
        />
      </button>

      <AnimatePresence>
        {open && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-50 pt-2.5"
          >
            <div className="absolute inset-x-0 top-0 h-2.5" aria-hidden />

            <ul className="min-w-[190px] overflow-hidden rounded-md border border-[var(--border)] bg-white py-2 shadow-[0_12px_36px_-10px_rgba(61,42,16,0.22)]">
              <li aria-hidden className="mx-3 mb-1.5 h-0.5 bg-gold-nav" />
              {children.map((child) => {
                const childActive = isActive(child.href, pathname);
                return (
                  <li key={child.id}>
                    <Link
                      href={child.href}
                      className={cn(
                        "mx-1.5 block rounded-sm px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200",
                        childActive
                          ? "bg-accent/10 text-primary"
                          : "text-primary/55 hover:bg-[var(--cream)] hover:text-primary"
                      )}
                    >
                      {child.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function DesktopNavItem({
  item,
  pathname,
  overHero,
}: {
  item: NavItem;
  pathname: string;
  overHero: boolean;
}) {
  if (item.children.length > 0) {
    return <DesktopDropdown item={item} pathname={pathname} overHero={overHero} />;
  }
  if (item.href === "#") return null;
  return (
    <li>
      <NavLink
        href={item.href}
        label={displayTitle(item.title)}
        active={isActive(item.href, pathname)}
        overHero={overHero}
      />
    </li>
  );
}

function MobileNavItem({
  item,
  pathname,
  onClose,
  index,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;
  const motionProps = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.05 + index * 0.03 },
  };

  if (hasChildren) {
    return (
      <motion.li className="border-b border-white/8" {...motionProps}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between py-5 text-left"
        >
          <span className="font-serif text-lg text-white">{item.title}</span>
          <ChevronDown className={cn("h-4 w-4 text-accent transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pb-3 pl-4"
            >
              {item.children.map((child) =>
                child.href === "#" ? null : (
                  <li key={child.id}>
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className="block py-2.5 text-sm text-white/70 hover:text-accent"
                    >
                      {child.title}
                    </Link>
                  </li>
                )
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.li>
    );
  }

  if (item.href === "#") return null;

  return (
    <motion.li className="border-b border-white/8" {...motionProps}>
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "block py-5 font-serif text-lg transition-colors",
          isActive(item.href, pathname) ? "text-accent" : "text-white hover:text-accent"
        )}
      >
        {item.title}
      </Link>
    </motion.li>
  );
}

export function SiteHeader({ siteName, logoUrl, menu }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const navItems = desktopMenu(menu);
  const isHome = pathname === "/";

  const updateScroll = useCallback(() => {
    if (!isHome) {
      setScrollProgress(1);
      return;
    }
    setScrollProgress(clamp01(window.scrollY / SCROLL_RANGE));
  }, [isHome]);

  useEffect(() => {
    updateScroll();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateScroll();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateScroll]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const p = isHome ? scrollProgress : 1;
  const overHero = p < 0.45;
  const headerBg = mixRgba([255, 255, 255, 0], [255, 255, 255, 1], p);
  const headerBorder = mixRgba([255, 255, 255, 0], [232, 220, 196, 0.65], p);
  const headerShadow =
    p > 0.08 ? `0 2px 20px -4px rgba(92, 66, 24, ${0.06 + 0.06 * p})` : "none";
  const backdropBlur = p < 0.05 ? "none" : `blur(${lerp(10, 0, p)}px)`;

  const goldStripH = lerp(0, 4, p);
  const taglineH = lerp(0, 28, p);
  const mainBarH = lerp(60, 72, p);

  const logoMaxH = lerp(48, 58, p);

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full max-w-[100vw] will-change-[background-color,box-shadow]"
        style={{
          backgroundColor: headerBg,
          borderBottom: `1px solid ${headerBorder}`,
          boxShadow: headerShadow,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
        }}
      >
        {/* Gold strip — grows in smoothly */}
        <div className="overflow-hidden" style={{ height: goldStripH }}>
          <div className="h-1 bg-gold-nav" />
        </div>

        {/* Tagline — expands smoothly (desktop) */}
        <div
          className="hidden overflow-hidden lg:block"
          style={{ height: taglineH, opacity: p }}
        >
          <div className="flex h-7 items-center border-b border-[var(--border)] bg-white">
            <div className="site-container flex w-full items-center justify-center">
              <p
                className="text-[10px] font-medium uppercase tracking-[0.2em] transition-[color] duration-150"
                style={{ color: "rgba(92, 66, 24, 0.55)" }}
              >
                Established 1918 · Vetapalem, Andhra Pradesh
              </p>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div
          className="site-container grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-4"
          style={{ height: mainBarH }}
        >
          <Link href="/" className="flex shrink-0 items-center">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={siteName}
                width={420}
                height={80}
                className="h-auto w-auto max-w-[240px] object-contain sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px]"
                style={{ height: logoMaxH, maxHeight: logoMaxH, width: "auto" }}
                priority
              />
            ) : (
              <span
                className={cn(
                  "line-clamp-2 max-w-[140px] font-serif text-base font-semibold leading-tight transition-colors duration-200 sm:max-w-none sm:text-xl",
                  overHero ? "text-white" : "text-primary"
                )}
              >
                {siteName}
              </span>
            )}
          </Link>

          <nav className="hidden justify-center lg:flex">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <DesktopNavItem key={item.id} item={item} pathname={pathname} overHero={overHero} />
              ))}
            </ul>
          </nav>

          <div className="hidden md:block lg:hidden" />

          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/search"
              data-cursor-hover
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                overHero
                  ? "text-white/75 hover:bg-white/12 hover:text-[var(--accent-light)]"
                  : "text-primary/50 hover:bg-primary/8 hover:text-accent"
              )}
              aria-label="Search"
            >
              <Search className="h-[17px] w-[17px] stroke-[1.5]" />
            </Link>

            <Link
              href="/page/contact-us"
              data-cursor-hover
              className="hidden items-center rounded-md border border-accent/25 bg-gold-nav px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-dark shadow-sm transition-all duration-200 hover:brightness-105 hover:shadow-md sm:inline-flex"
            >
              Contact
            </Link>

            <button
              type="button"
              className={cn(
                "group flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full transition-all duration-200 lg:hidden",
                overHero ? "hover:bg-white/12" : "hover:bg-primary/8"
              )}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className={cn("h-px w-5 transition-colors duration-200", overHero ? "bg-white group-hover:bg-[var(--accent-light)]" : "bg-primary")} />
              <span className={cn("h-px w-5 transition-colors duration-200", overHero ? "bg-white group-hover:bg-[var(--accent-light)]" : "bg-primary")} />
              <span className={cn("h-[1.5px] w-3 transition-colors duration-200", overHero ? "bg-[var(--accent-light)]" : "bg-accent")} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-primary"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-8 py-6">
                <span className="font-serif text-xl text-white">{siteName}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-white/70 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-8 py-4">
                <ul>
                  {menu.map((item, i) => (
                    <MobileNavItem
                      key={item.id}
                      item={item}
                      pathname={pathname}
                      index={i}
                      onClose={() => setMobileOpen(false)}
                    />
                  ))}
                </ul>
              </nav>

              <div className="border-t border-white/10 px-8 py-6">
                <Link
                  href="/page/contact-us"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full border border-accent py-3.5 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent hover:text-primary"
                >
                  Contact Us
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
