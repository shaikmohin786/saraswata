export type MediaCategory =
  | "brand"
  | "sliders"
  | "posts"
  | "posts/category"
  | "pages"
  | "gallery"
  | "gallery/category"
  | "gallery/thumbs"
  | "videos/category"
  | "users"
  | "defaults/posts"
  | "defaults/gallery"
  | "defaults/videos"
  | "images";

const LEGACY_PREFIX_MAP: Record<string, MediaCategory> = {
  "uploads/config/site_logo/": "brand",
  "uploads/sliders/": "sliders",
  "uploads/cms/posts/post/": "posts",
  "uploads/cms/posts/category/": "posts/category",
  "uploads/cms/pages/page/": "pages",
  "uploads/gallery/category/": "gallery/category",
  "uploads/gallery/thumbs/": "gallery/thumbs",
  "uploads/gallery/": "gallery",
  "uploads/video/category/": "videos/category",
  "uploads/users/": "users",
  "uploads/misc/posts/": "defaults/posts",
  "uploads/misc/gallery/": "defaults/gallery",
  "uploads/misc/videos/": "defaults/videos",
  "uploads/images/": "images",
};

export function resolveMediaUrl(
  category: MediaCategory,
  filename?: string | null
): string | null {
  if (!filename || filename.trim() === "") return null;

  const trimmed = filename.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/media/")) {
    return trimmed;
  }

  for (const [legacyPrefix, mappedCategory] of Object.entries(
    LEGACY_PREFIX_MAP
  )) {
    if (trimmed.startsWith(legacyPrefix)) {
      const name = trimmed.slice(legacyPrefix.length);
      return `/media/${mappedCategory}/${name}`;
    }
  }

  if (trimmed.startsWith("uploads/")) {
    return `/${trimmed.replace(/^uploads\//, "media/")}`;
  }

  return `/media/${category}/${trimmed}`;
}
