import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
import { FadeIn } from "./FadeIn";

export type VideoGridItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  excerpt?: string;
};

export function VideoGrid({ items, featuredLayout = true }: { items: VideoGridItem[]; featuredLayout?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-muted">
        Sorry, no videos found.
      </div>
    );
  }

  const featured = featuredLayout ? items[0] : null;
  const rest = featuredLayout ? items.slice(1) : items;

  return (
    <div className="space-y-8">
      {featured && (
        <FadeIn>
          <Link href={featured.href} className="group block">
            <article className="card-premium relative overflow-hidden rounded-xl ring-1 ring-[var(--border)]">
              <div className="relative aspect-[21/9] min-h-[220px] overflow-hidden bg-primary">
                {featured.imageUrl ? (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-primary/30" />
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-6 lg:px-10">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-primary shadow-xl shadow-accent/30 transition-transform group-hover:scale-110">
                      <Play className="h-7 w-7 fill-current pl-1" />
                    </div>
                    <div>
                      <p className="section-label mb-2 text-accent-light">Featured Video</p>
                      <h2 className="font-serif text-2xl font-semibold text-white md:text-3xl">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-2 line-clamp-2 max-w-xl text-sm text-white/70">{featured.excerpt}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </FadeIn>
      )}

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((video, i) => (
            <FadeIn key={video.id} delay={i * 0.06}>
              <Link href={video.href} className="group block h-full">
                <article className="card-premium flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)]">
                  <div className="relative aspect-video overflow-hidden img-zoom-wrap">
                    {video.imageUrl ? (
                      <>
                        <Image
                          src={video.imageUrl}
                          alt={video.title}
                          fill
                          className="img-zoom-target object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary shadow-lg">
                            <Play className="h-5 w-5 fill-current pl-0.5" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-secondary">
                        <Play className="h-10 w-10 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-accent">
                      {video.title}
                    </h3>
                    {video.excerpt && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{video.excerpt}</p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Watch <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </article>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
