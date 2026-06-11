import { notFound } from "next/navigation";
import { PageShell } from "@/components/public/shared/PageShell";
import { ContentGrid } from "@/components/public/shared/ContentGrid";
import { VideoGrid } from "@/components/public/shared/VideoGrid";
import { Pagination } from "@/components/public/shared/Pagination";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import {
  getVideoAlbums,
  getVideoCategoryAncestors,
  getVideoCategoryBySlug,
  getVideosCount,
  getVideosPaginated,
} from "@/lib/db/queries/videos";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { youtubeThumbUrl } from "@/lib/youtube";
import type { BreadcrumbItem } from "@/types/cms";

const PER_PAGE = 12;

type Props = {
  params: Promise<{ segments?: string[] }>;
};

function parseSegments(segments?: string[]) {
  if (!segments || segments.length === 0) {
    return { categorySlug: undefined, page: 1 };
  }
  if (segments[0] === "view") notFound();
  if (segments.length === 1) {
    return { categorySlug: segments[0], page: 1 };
  }
  const page = parseInt(segments[1], 10);
  if (isNaN(page) || page < 1) notFound();
  return { categorySlug: segments[0], page };
}

export async function generateMetadata({ params }: Props) {
  const { segments } = await params;
  const { categorySlug } = parseSegments(segments);
  const category = categorySlug ? await getVideoCategoryBySlug(categorySlug) : null;
  return { title: category ? category.VideoCategoryTitle : "Videos" };
}

export default async function VideosPage({ params }: Props) {
  const { segments } = await params;
  const { categorySlug, page } = parseSegments(segments);

  const settings = await getGlobalSettings();
  const category = categorySlug ? await getVideoCategoryBySlug(categorySlug) : null;
  if (categorySlug && !category) notFound();

  const catId = category?.VideoCategoryID ?? 0;
  const offset = (page - 1) * PER_PAGE;

  const [albums, totalCount, videos, ancestors] = await Promise.all([
    getVideoAlbums(catId),
    getVideosCount(catId),
    getVideosPaginated(catId, PER_PAGE, offset),
    category ? getVideoCategoryAncestors(catId) : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  if (page > totalPages && totalCount > 0) notFound();

  const pageTitle = category?.VideoCategoryTitle ?? "Videos";
  const basePath = categorySlug ? `/videos/${categorySlug}` : "/videos";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Videos", href: "/videos" },
    ...ancestors.map((a) => ({
      label: a.VideoCategoryTitle,
      href: `/videos/${a.VideoCategoryTitleAlias}`,
    })),
    ...(category ? [{ label: category.VideoCategoryTitle }] : []),
  ];

  const bannerSrc = category?.VideoCategoryHeaderImage
    ? resolveMediaUrl("videos/category", category.VideoCategoryHeaderImage)
    : resolveMediaUrl("defaults/videos", settings?.ConfigVideosImage ?? null);

  const albumItems = albums.map((album) => ({
    id: album.VideoCategoryID,
    title: album.VideoCategoryTitle,
    href: `/videos/${album.VideoCategoryTitleAlias}`,
    imageUrl: resolveMediaUrl("videos/category", album.VideoCategoryImage),
  }));

  const videoItems = videos.map((v) => ({
    id: v.VideoID,
    title: v.VideoTitle,
    href: `/videos/view/${encodeURIComponent(v.VideoTitleAlias)}`,
    imageUrl: youtubeThumbUrl(v.VideoYoutubeURL),
    excerpt: v.VideoDescription?.replace(/<[^>]+>/g, "").slice(0, 120),
  }));

  return (
    <PageShell
      title={pageTitle}
      subtitle="Documentaries, recordings and video archives from our library"
      breadcrumbs={breadcrumbs}
      bannerSrc={bannerSrc}
      bannerAlt="Videos"
    >
      {albumItems.length > 0 && (
        <section className="mb-12">
          <div className="mb-8">
            <p className="section-label mb-2">Browse</p>
            <h2 className="font-serif text-2xl font-semibold text-primary">Categories</h2>
            <p className="mt-2 text-sm text-muted">Browse videos by collection.</p>
          </div>
          <ContentGrid items={albumItems} />
        </section>
      )}

      <section>
        {videoItems.length > 0 && (
          <div className="mb-8">
            <p className="section-label mb-2">Media</p>
            <h2 className="font-serif text-2xl font-semibold text-primary">All Videos</h2>
            <p className="mt-2 text-sm text-muted">
              {totalCount} video{totalCount !== 1 ? "s" : ""} available.
            </p>
          </div>
        )}
        {videoItems.length === 0 && albumItems.length === 0 ? (
          <p className="py-12 text-center text-muted">Sorry, no videos found.</p>
        ) : (
          <VideoGrid items={videoItems} featuredLayout={page === 1} />
        )}
        {totalPages > 1 && (
          <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
        )}
      </section>
    </PageShell>
  );
}
