"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  title?: string;
};

type LightboxProps = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const current = index !== null ? items[index] : null;

  const prev = useCallback(() => {
    if (index === null) return;
    onNavigate(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onNavigate]);

  const next = useCallback(() => {
    if (index === null) return;
    onNavigate(index === items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, prev, next]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-dark/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition-all hover:border-accent hover:bg-accent/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 border border-white/20 bg-white/10 p-3 text-white backdrop-blur transition-all hover:border-accent hover:bg-accent/20"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mx-4 max-h-[85vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] overflow-hidden rounded-lg ring-1 ring-white/10">
              <Image
                src={current.src}
                alt={current.alt}
                width={1200}
                height={800}
                className="h-auto max-h-[75vh] w-auto object-contain"
                priority
              />
            </div>
            {current.title && (
              <p className="mt-4 text-center font-serif text-lg text-white/90">{current.title}</p>
            )}
            {items.length > 1 && (
              <p className="mt-2 text-center text-xs text-white/50">
                {(index ?? 0) + 1} / {items.length}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
