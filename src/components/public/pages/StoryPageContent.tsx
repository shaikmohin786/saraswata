import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { ManagementCommitteeContent } from "@/components/public/pages/ManagementCommitteeContent";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";
import { getStoryPageMeta } from "@/lib/cms/story-pages";
import { isManagementSlug, parseCommitteeContent } from "@/lib/cms/parse-committee";
import { cn } from "@/lib/utils";

type StoryPageContentProps = {
  slug: string;
  html: string;
};

export function StoryPageContent({ slug, html }: StoryPageContentProps) {
  const meta = getStoryPageMeta(slug);
  const Icon = meta.icon;
  const showCollectionStrip = slug === "collection-of-books";
  const isManagement = isManagementSlug(slug);
  const committee = isManagement ? parseCommitteeContent(html) : null;

  const sidebarGlance =
    isManagement && committee
      ? [
          committee.officers[0]
            ? `${committee.officers[0].role}: ${committee.officers[0].name}`
            : meta.glance[0],
          `${committee.members.length} committee members`,
          "Volunteer-led institution",
        ]
      : meta.glance;

  return (
    <div className="mx-auto max-w-6xl">
      {showCollectionStrip && (
        <FadeIn>
          <div className="mb-8 grid grid-cols-3 divide-x divide-[var(--border)] border border-[var(--border)] bg-white text-center">
            {[
              { value: "10,000+", label: "Volumes" },
              { value: "Rare", label: "Manuscripts" },
              { value: "1918", label: "Heritage" },
            ].map((item) => (
              <div key={item.label} className="px-3 py-4 sm:py-5">
                <p className="font-serif text-lg font-semibold text-primary sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      )}

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-12 xl:gap-16">
        <FadeIn delay={0.05}>
          <article className="min-w-0">
            {isManagement && committee ? (
              <ManagementCommitteeContent
                html={html}
                label={meta.label}
                subtitle={meta.subtitle}
              />
            ) : (
              <>
                <header className="mb-8 border-b border-[var(--border)] pb-7">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-gradient/25 text-primary">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <p className="section-label">{meta.label}</p>
                      <p className="mt-2 text-base leading-relaxed text-muted sm:text-lg">
                        {meta.subtitle}
                      </p>
                    </div>
                  </div>
                </header>

                <div
                  className={cn(
                    "story-prose cms-prose",
                    slug === "founder" || slug === "about-us" ? "institution-prose" : ""
                  )}
                  dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
                />
              </>
            )}
          </article>
        </FadeIn>

        <FadeIn delay={0.1}>
          <aside className="mt-10 lg:mt-0">
            <div className="lg:sticky lg:top-24 lg:space-y-6">
              <div className="border-l-[3px] border-accent pl-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  At a glance
                </p>
                <ul className="mt-3 space-y-2">
                  {sidebarGlance.map((item) => (
                    <li key={item} className="text-sm leading-snug text-primary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <nav aria-label="Related pages" className="border-t border-[var(--border)] pt-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Explore further
                </p>
                <ul className="mt-3 space-y-1">
                  {meta.related.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1.5 py-1.5 text-sm text-primary transition-colors hover:text-accent"
                      >
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </FadeIn>
      </div>
    </div>
  );
}
