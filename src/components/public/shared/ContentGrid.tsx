import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

export type GridItem = {
  id: number;
  title: string;
  href: string;
  imageUrl?: string | null;
  excerpt?: string;
};

export function ContentGrid({ items }: { items: GridItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] py-20 text-center">
        <p className="text-muted">No items found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <FadeIn key={item.id} delay={i * 0.06}>
          <Link href={item.href} className="group block h-full">
            <article className="card-premium flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)]">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary img-zoom-wrap">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="img-zoom-target object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-serif text-4xl text-primary/10">◈</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg font-semibold text-primary transition-colors group-hover:text-accent">
                    {item.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-accent opacity-0 transition-all group-hover:opacity-100" />
                </div>
                {item.excerpt && (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{item.excerpt}</p>
                )}
              </div>
            </article>
          </Link>
        </FadeIn>
      ))}
    </div>
  );
}
