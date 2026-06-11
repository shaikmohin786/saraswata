import { notFound } from "next/navigation";
import { PageShell } from "@/components/public/shared/PageShell";
import { ContentGrid } from "@/components/public/shared/ContentGrid";
import { GalleryMasonry } from "@/components/public/shared/GalleryMasonry";
import { Pagination } from "@/components/public/shared/Pagination";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import {
  getGalleryAlbums,
  getGalleryCategoryAncestors,
  getGalleryCategoryBySlug,
  getGalleries,
  getGalleryCount,
} from "@/lib/db/queries/gallery";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
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
  const category = categorySlug ? await getGalleryCategoryBySlug(categorySlug) : null;
  return { title: category ? category.GalleryCategoryTitle : "Photo Gallery" };
}

export default async function GalleryPage({ params }: Props) {
  const { segments } = await params;
  const { categorySlug, page } = parseSegments(segments);

  const settings = await getGlobalSettings();
  const category = categorySlug ? await getGalleryCategoryBySlug(categorySlug) : null;
  if (categorySlug && !category) notFound();

  const catId = category?.GalleryCategoryID ?? 0;
  const [albums, total, galleries, ancestors] = await Promise.all([
    getGalleryAlbums(catId),
    getGalleryCount(catId),
    getGalleries(catId, PER_PAGE, (page - 1) * PER_PAGE),
    category ? getGalleryCategoryAncestors(catId) : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (page > totalPages && total > 0) notFound();

  const basePath = categorySlug ? `/gallery/${categorySlug}` : "/gallery";
  const pageTitle = category?.GalleryCategoryTitle ?? "Photo Gallery";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    ...ancestors.map((a) => ({
      label: a.GalleryCategoryTitle,
      href: `/gallery/${a.GalleryCategoryTitleAlias}`,
    })),
    ...(category ? [{ label: category.GalleryCategoryTitle }] : []),
  ];

  const bannerSrc = category?.GalleryCategoryHeaderImage
    ? resolveMediaUrl("gallery/category", category.GalleryCategoryHeaderImage)
    : resolveMediaUrl("defaults/gallery", settings?.ConfigGalleryImage ?? null);

  const albumItems = albums.map((album) => ({
    id: album.GalleryCategoryID,
    title: album.GalleryCategoryTitle,
    href: `/gallery/${album.GalleryCategoryTitleAlias}`,
    imageUrl: resolveMediaUrl("gallery/category", album.GalleryCategoryImage),
  }));

  const galleryItems = galleries.map((g, i) => ({
    id: g.GalleryID,
    title: g.GalleryTitle,
    href: `/gallery/view/${encodeURIComponent(g.GalleryTitleAlias)}`,
    imageUrl: resolveMediaUrl("gallery", g.GalleryImage),
    tall: i % 5 === 0,
  }));

  return (
    <PageShell
      title={pageTitle}
      subtitle="Historic photographs, archives and visual records from Saraswata Niketanam"
      breadcrumbs={breadcrumbs}
      bannerSrc={bannerSrc}
      bannerAlt="Photo Gallery"
    >
      {albumItems.length > 0 && (
        <section className="mb-12">
          <div className="mb-8">
            <p className="section-label mb-2">Browse</p>
            <h2 className="font-serif text-2xl font-semibold text-primary">Albums</h2>
            <p className="mt-2 text-sm text-muted">Explore photo collections by category.</p>
          </div>
          <ContentGrid items={albumItems} />
        </section>
      )}

      <section>
        {galleryItems.length > 0 && (
          <div className="mb-8">
            <p className="section-label mb-2">Archives</p>
            <h2 className="font-serif text-2xl font-semibold text-primary">Photos</h2>
            <p className="mt-2 text-sm text-muted">
              {total} photograph{total !== 1 ? "s" : ""} in this section.
            </p>
          </div>
        )}
        {galleryItems.length === 0 && albumItems.length === 0 ? (
          <p className="py-12 text-center text-muted">Sorry, no galleries found.</p>
        ) : (
          <GalleryMasonry items={galleryItems} enableLightbox showTitles />
        )}
        <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
      </section>
    </PageShell>
  );
}
