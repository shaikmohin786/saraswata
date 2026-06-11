import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";
import { Breadcrumbs } from "./Breadcrumbs";
import { HomeBackLink } from "./HomeBackLink";
import type { BreadcrumbItem } from "@/types/cms";

type ArticleDetailProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  imageUrl?: string | null;
  html: string;
  date?: string;
  videoEmbedUrl?: string | null;
  prev?: { title: string; href: string } | null;
  next?: { title: string; href: string } | null;
  related?: { title: string; href: string }[];
};

function categoryFromBreadcrumbs(items: BreadcrumbItem[]) {
  if (items.length < 2) return null;
  const current = items[items.length - 1];
  if (current.href) return null;
  const parent = items[items.length - 2];
  return parent?.label ?? null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleDetail({
  title,
  breadcrumbs,
  imageUrl,
  html,
  date,
  videoEmbedUrl,
  prev,
  next,
  related,
}: ArticleDetailProps) {
  const category = categoryFromBreadcrumbs(breadcrumbs);

  return (
    <article className="bg-[var(--background)]">
      <div className="site-container py-10 md:py-14 lg:py-16">
        <div className="article-read mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-muted/90">
            <Breadcrumbs items={breadcrumbs} />
          </nav>

          <header className="mb-8 md:mb-10">
            {category && (
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                {category}
              </p>
            )}
            <h1 className="font-serif text-[clamp(1.75rem,4vw,2.625rem)] font-semibold leading-[1.12] tracking-tight text-primary">
              {title}
            </h1>
            {date && (
              <time dateTime={date} className="mt-4 block text-sm text-muted">
                {formatDate(date)}
              </time>
            )}
            <div className="mt-7 h-px w-full bg-gradient-to-r from-accent/70 via-[var(--border)] to-transparent" />
          </header>

          {imageUrl && (
            <figure className="mb-8 md:mb-10">
              <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              </div>
            </figure>
          )}

          <div
            className="article-prose cms-prose"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
          />

          {videoEmbedUrl && (
            <div className="mt-10 aspect-video overflow-hidden bg-primary/5">
              <iframe
                src={videoEmbedUrl}
                title={title}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          )}

          {(prev || next) && (
            <nav
              className="mt-12 flex flex-col gap-6 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-start sm:justify-between"
              aria-label="Article navigation"
            >
              {prev ? (
                <Link
                  href={prev.href}
                  className="group max-w-[16rem] text-left sm:max-w-[45%]"
                >
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    <ArrowLeft className="h-3 w-3" />
                    Previous
                  </span>
                  <span className="mt-1.5 block font-serif text-base leading-snug text-primary transition-colors group-hover:text-accent">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={next.href}
                  className="group max-w-[16rem] text-left sm:max-w-[45%] sm:text-right"
                >
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted sm:justify-end">
                    Next
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1.5 block font-serif text-base leading-snug text-primary transition-colors group-hover:text-accent">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          )}

          {related && related.length > 0 && (
            <aside className="mt-10 border-t border-[var(--border)] pt-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                Related reading
              </h2>
              <ul className="mt-4 space-y-2.5">
                {related.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-serif text-[15px] leading-snug text-primary transition-colors hover:text-accent"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <footer className="mt-12 border-t border-[var(--border)] pt-8">
            <HomeBackLink className="back-link">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </HomeBackLink>
          </footer>
        </div>
      </div>
    </article>
  );
}
