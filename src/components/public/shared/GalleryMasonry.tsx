"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Expand, ArrowUpRight } from "lucide-react";
import { FadeIn } from "./FadeIn";
import { Lightbox, type LightboxItem } from "./Lightbox";

export type MasonryItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  tall?: boolean;
};

type GalleryMasonryProps = {
  items: MasonryItem[];
  enableLightbox?: boolean;
  showTitles?: boolean;
};

export function GalleryMasonry({ items, enableLightbox = true, showTitles = true }: GalleryMasonryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const lightboxItems: LightboxItem[] = items
    .filter((i) => i.imageUrl)
    .map((i) => ({ src: i.imageUrl!, alt: i.title, title: i.title }));

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center">
        <p className="text-muted">No items found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="masonry-grid">
        {items.map((item, i) => (
          <FadeIn key={item.id} delay={i * 0.05} className="masonry-item">
            <article className="group relative overflow-hidden rounded-lg bg-white ring-1 ring-[var(--border)] card-premium">
              <div className={`relative img-zoom-wrap ${item.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}>
                {item.imageUrl ? (
                  <>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="img-zoom-target object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {enableLightbox && (
                        <button
                          type="button"
                          onClick={() => {
                            const idx = lightboxItems.findIndex((l) => l.src === item.imageUrl);
                            if (idx >= 0) setLightboxIndex(idx);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary transition-transform hover:scale-110"
                          aria-label="View full size"
                        >
                          <Expand className="h-5 w-5" />
                        </button>
                      )}
                      <Link
                        href={item.href}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary transition-transform hover:scale-110"
                        aria-label={`View ${item.title}`}
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-secondary">
                    <span className="font-serif text-4xl text-primary/15">◈</span>
                  </div>
                )}
              </div>
              {showTitles && (
                <div className="border-t border-[var(--border)] px-4 py-3">
                  <h3 className="line-clamp-2 text-sm font-medium text-primary transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                </div>
              )}
            </article>
          </FadeIn>
        ))}
      </div>

      {enableLightbox && (
        <Lightbox
          items={lightboxItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
