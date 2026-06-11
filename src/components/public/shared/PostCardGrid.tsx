import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { FadeIn } from "./FadeIn";

export type PostCardItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  excerpt?: string;
  date?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCardGrid({ items, featuredLayout = true }: { items: PostCardItem[]; featuredLayout?: boolean }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] py-16 text-center text-muted">
        Sorry, no posts found.
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
            <article className="card-premium overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)] lg:grid lg:grid-cols-2">
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[320px]">
                {featured.imageUrl ? (
                  <Image
                    src={featured.imageUrl}
                    alt={featured.title}
                    fill
                    className="img-zoom-target object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex h-full min-h-[240px] items-center justify-center bg-hero-gradient">
                    <span className="section-label text-accent-light">Featured</span>
                  </div>
                )}
                <div className="absolute left-4 top-4 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-dark">
                  Featured
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-10">
                {featured.date && (
                  <p className="mb-3 flex items-center gap-2 text-xs text-muted">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    {formatDate(featured.date)}
                  </p>
                )}
                <h2 className="font-serif text-2xl font-semibold leading-snug text-primary transition-colors group-hover:text-accent md:text-3xl">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="mt-4 line-clamp-3 text-muted leading-relaxed">{featured.excerpt}</p>
                )}
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                  Read Article <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </Link>
        </FadeIn>
      )}

      {rest.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <FadeIn key={post.id} delay={i * 0.06}>
              <Link href={post.href} className="group block h-full">
                <article className="card-premium flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-[var(--border)]">
                  <div className="relative aspect-[16/10] overflow-hidden img-zoom-wrap">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="img-zoom-target object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-secondary">
                        <span className="font-serif text-3xl text-primary/10">§</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {post.date && (
                      <p className="mb-2 flex items-center gap-1.5 text-[11px] text-muted">
                        <Calendar className="h-3 w-3 text-accent" />
                        {formatDate(post.date)}
                      </p>
                    )}
                    <h3 className="line-clamp-2 font-serif text-lg font-semibold text-primary transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{post.excerpt}</p>
                    )}
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
