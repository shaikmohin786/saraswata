import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/public/shared/ArticleDetail";
import {
  getAdjacentGallery,
  getGalleryBySlug,
  getGalleryCategoryAncestors,
  getGalleryCategoryById,
} from "@/lib/db/queries/gallery";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import type { BreadcrumbItem } from "@/types/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  return { title: gallery?.GalleryTitle ?? "Gallery" };
}

export default async function GalleryViewPage({ params }: Props) {
  const { slug } = await params;
  const gallery = await getGalleryBySlug(slug);
  if (!gallery) notFound();

  const category = await getGalleryCategoryById(gallery.GalleryCategory);
  const ancestors = category
    ? await getGalleryCategoryAncestors(category.GalleryCategoryID)
    : [];

  const [prev, next] = await Promise.all([
    getAdjacentGallery(gallery.GalleryID, "prev"),
    getAdjacentGallery(gallery.GalleryID, "next"),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    ...ancestors.map((a) => ({
      label: a.GalleryCategoryTitle,
      href: `/gallery/${a.GalleryCategoryTitleAlias}`,
    })),
    ...(category
      ? [{ label: category.GalleryCategoryTitle, href: `/gallery/${category.GalleryCategoryTitleAlias}` }]
      : []),
    { label: gallery.GalleryTitle },
  ];

  return (
    <ArticleDetail
      title={gallery.GalleryTitle}
      breadcrumbs={breadcrumbs}
      imageUrl={resolveMediaUrl("gallery", gallery.GalleryImage)}
      html={gallery.GalleryDescription}
      prev={
        prev
          ? { title: prev.GalleryTitle, href: `/gallery/view/${prev.GalleryTitleAlias}` }
          : null
      }
      next={
        next
          ? { title: next.GalleryTitle, href: `/gallery/view/${next.GalleryTitleAlias}` }
          : null
      }
    />
  );
}
