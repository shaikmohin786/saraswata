import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { searchContent, type SearchResult } from "@/lib/db/queries/admin";
import { SectionBanner } from "@/components/public/shared/SectionBanner";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { HomeBackLink } from "@/components/public/shared/HomeBackLink";

type Props = { searchParams: Promise<{ q?: string }> };

function resultHref(type: string, slug: string) {
  switch (type) {
    case "post":
      return `/${slug}`;
    case "page":
      return `/page/${slug}`;
    case "gallery":
      return `/gallery/view/${slug}`;
    case "video":
      return `/videos/view/${slug}`;
    default:
      return "/";
  }
}

const typeLabels: Record<string, string> = {
  post: "Article",
  page: "Page",
  gallery: "Photo",
  video: "Video",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const term = q?.trim() ?? "";
  const results = term ? await searchContent(term) : [];

  return (
    <>
      <SectionBanner src={null} alt="Search" title="Search" />
      <div className="site-container page-content">
        <FadeIn>
          <HomeBackLink className="back-link mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </HomeBackLink>
          <form method="get" className="relative max-w-3xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={term}
              placeholder="Search posts, pages, gallery, videos..."
              className="w-full rounded-2xl border border-[var(--border)] bg-white py-4 pl-14 pr-6 text-primary shadow-sm transition-all placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </form>
        </FadeIn>

        {term && (
          <FadeIn delay={0.1}>
            <div className="mt-10 space-y-4">
              <p className="text-sm text-muted">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{term}&rdquo;
              </p>
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-muted">
                  No results found. Try a different search term.
                </div>
              ) : (
                <ul className="space-y-3">
                  {results.map((r: SearchResult) => (
                    <li key={`${r.type}-${r.id}`}>
                      <Link
                        href={resultHref(r.type, encodeURIComponent(r.slug))}
                        className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-6 py-4 transition-all hover:border-accent/40 hover:shadow-md"
                      >
                        <span className="font-medium text-primary group-hover:text-accent">{r.title}</span>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted">
                          {typeLabels[r.type] ?? r.type}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </>
  );
}
