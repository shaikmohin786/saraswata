import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/public/shared/ArticleDetail";
import {
  getVideoBySlug,
  getVideoCategoryAncestors,
  getVideoCategoryById,
} from "@/lib/db/queries/videos";
import { youtubeEmbedUrl } from "@/lib/youtube";
import type { BreadcrumbItem } from "@/types/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  return { title: video?.VideoTitle ?? "Video" };
}

export default async function VideoViewPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const category = await getVideoCategoryById(video.VideoCategory);
  const ancestors = category
    ? await getVideoCategoryAncestors(category.VideoCategoryID)
    : [];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Videos", href: "/videos" },
    ...ancestors.map((a) => ({
      label: a.VideoCategoryTitle,
      href: `/videos/${a.VideoCategoryTitleAlias}`,
    })),
    ...(category
      ? [{ label: category.VideoCategoryTitle, href: `/videos/${category.VideoCategoryTitleAlias}` }]
      : []),
    { label: video.VideoTitle },
  ];

  return (
    <ArticleDetail
      title={video.VideoTitle}
      breadcrumbs={breadcrumbs}
      html={video.VideoDescription}
      videoEmbedUrl={youtubeEmbedUrl(video.VideoYoutubeURL)}
    />
  );
}
