import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { query } from "@/lib/db/connection";

function safeDate(value?: string | null) {
  if (!value) return new Date();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/posts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/videos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const [pages, posts, galleries, videos] = await Promise.all([
      query<{ PageTitleAlias: string; PageModified: string }>(
        "SELECT PageTitleAlias, PageModified FROM pages WHERE PageDelete=0 AND PageStatus=0"
      ),
      query<{ PostTitleAlias: string; PostModified: string }>(
        "SELECT PostTitleAlias, PostModified FROM posts WHERE PostDelete=0 AND PostStatus=0"
      ),
      query<{ GalleryTitleAlias: string; GalleryModified: string }>(
        "SELECT GalleryTitleAlias, GalleryModified FROM gallery WHERE GalleryDelete=0 AND GalleryStatus=0"
      ),
      query<{ VideoTitleAlias: string; VideoModified: string }>(
        "SELECT VideoTitleAlias, VideoModified FROM videos WHERE VideoDelete=0 AND VideoStatus=0"
      ),
    ]);

    return [
      ...staticRoutes,
      ...pages.map((p) => ({
        url: `${base}/page/${p.PageTitleAlias}`,
        lastModified: safeDate(p.PageModified),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...posts.map((p) => ({
        url: `${base}/${p.PostTitleAlias}`,
        lastModified: safeDate(p.PostModified),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...galleries.map((g) => ({
        url: `${base}/gallery/view/${g.GalleryTitleAlias}`,
        lastModified: safeDate(g.GalleryModified),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...videos.map((v) => ({
        url: `${base}/videos/view/${v.VideoTitleAlias}`,
        lastModified: safeDate(v.VideoModified),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
