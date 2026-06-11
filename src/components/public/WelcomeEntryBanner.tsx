"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, MapPin } from "lucide-react";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";
import { peekHomeReturnSection } from "@/lib/navigation/home-section";

const STORAGE_KEY = "saraswata-welcome-banner-v4";

type WelcomeEntryBannerProps = {
  siteName: string;
  logoUrl?: string | null;
  workingHoursHtml?: string;
};

function shouldSkipScrollReset() {
  return Boolean(peekHomeReturnSection() || window.location.hash);
}

export function WelcomeEntryBanner({
  siteName,
  logoUrl,
  workingHoursHtml,
}: WelcomeEntryBannerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldSkipScrollReset()) return;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* private browsing */
    }
    const timer = window.setTimeout(() => setOpen(true), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    if (!shouldSkipScrollReset()) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      if (!shouldSkipScrollReset()) {
        window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, scrollY);
      }
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            className="absolute inset-0 bg-primary/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-[101] w-full max-w-[540px] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--cream)] shadow-[0_24px_64px_rgba(61,42,16,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 bg-gold-nav" />

            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-white text-primary/70 transition hover:border-accent hover:text-primary"
              aria-label="Close welcome message"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="relative flex h-[140px] items-center justify-center border-b border-[var(--border)] bg-warm-gradient px-12 py-4 sm:h-[165px]">
              {logoUrl ? (
                <div className="relative h-full w-full max-w-[420px]">
                  <Image
                    src={logoUrl}
                    alt={siteName}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 540px) 90vw, 420px"
                    priority
                  />
                </div>
              ) : (
                <p className="text-center font-serif text-xl text-primary sm:text-2xl">{siteName}</p>
              )}
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <p className="section-label mb-2 text-center">Plan Your Visit</p>
              <h2
                id="welcome-popup-title"
                className="text-center font-serif text-xl font-semibold leading-snug text-primary sm:text-2xl"
              >
                Working Hours &amp; Location
              </h2>
              <div className="mx-auto mt-4 accent-line accent-line-center" />

              <div className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-8">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    Working Hours
                  </p>
                  {workingHoursHtml ? (
                    <div
                      className="cms-prose text-sm leading-relaxed text-muted [&_*]:text-sm [&_*]:text-muted"
                      dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(workingHoursHtml) }}
                    />
                  ) : (
                    <div className="space-y-1 text-sm leading-relaxed text-muted">
                      <p>8 a.m. to 11 a.m.</p>
                      <p>3 p.m. to 6 p.m.</p>
                      <p className="pt-1 font-medium text-[var(--terracotta)]">Friday — weekly holiday</p>
                    </div>
                  )}
                </div>

                <div className="sm:border-l sm:border-[var(--border)] sm:pl-6">
                  <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    Address
                  </p>
                  <address className="not-italic text-sm leading-relaxed text-muted">
                    <strong className="font-semibold text-primary">Saraswata Niketanam</strong>
                    <br />
                    Vetapalem, Chirala
                    <br />
                    Andhra Pradesh
                    <br />
                    India - 523187
                  </address>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
