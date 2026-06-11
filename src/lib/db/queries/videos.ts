import { cache } from "react";
import { query, queryOne } from "@/lib/db/connection";
import { buildAncestorsFromMap } from "@/lib/db/category-ancestors";
import type { CmsVideo, VideoCategory } from "@/types/cms";

const ACTIVE = "VideoStatus = 0 AND VideoDelete = 0";
const CAT_ACTIVE = "VideoCategoryStatus = 0 AND VideoCategoryDelete = 0";

export async function getLatestVideos(limit = 4) {
  return query<CmsVideo>(
    `SELECT VideoID, VideoTitle, VideoTitleAlias, VideoCategory, VideoYoutubeURL,
            VideoDescription, VideoTags, VideoMetaTitle
     FROM videos WHERE ${ACTIVE} ORDER BY VideoCreated DESC LIMIT ?`,
    [limit]
  );
}

export async function getVideoBySlug(slug: string) {
  return queryOne<CmsVideo>(
    `SELECT * FROM videos WHERE ${ACTIVE} AND VideoTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getVideoCategoryBySlug(slug: string) {
  return queryOne<VideoCategory>(
    `SELECT VideoCategoryID, VideoCategoryTitle, VideoCategoryTitleAlias,
            VideoCategoryParentID, VideoCategoryHeaderImage, VideoCategoryImage
     FROM video_category WHERE ${CAT_ACTIVE} AND VideoCategoryTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getVideoCategoryById(id: number) {
  return queryOne<VideoCategory>(
    `SELECT VideoCategoryID, VideoCategoryTitle, VideoCategoryTitleAlias,
            VideoCategoryParentID, VideoCategoryHeaderImage, VideoCategoryImage
     FROM video_category WHERE VideoCategoryID = ? LIMIT 1`,
    [id]
  );
}

const getVideoCategoryMap = cache(async () => {
  const rows = await query<VideoCategory>(
    `SELECT VideoCategoryID, VideoCategoryTitle, VideoCategoryTitleAlias,
            VideoCategoryParentID, VideoCategoryHeaderImage, VideoCategoryImage
     FROM video_category WHERE ${CAT_ACTIVE}`
  );
  return new Map(rows.map((r) => [r.VideoCategoryID, r]));
});

export async function getVideoCategoryAncestors(catId: number): Promise<VideoCategory[]> {
  const map = await getVideoCategoryMap();
  return buildAncestorsFromMap(catId, map, "VideoCategoryID", "VideoCategoryParentID");
}

export async function getVideosCount(catId = 0) {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM videos WHERE ${ACTIVE} AND VideoCategory = ?`,
    [catId]
  );
  return row?.count ?? 0;
}

export async function getVideosPaginated(catId = 0, limit = 12, offset = 0) {
  return query<CmsVideo>(
    `SELECT VideoID, VideoTitle, VideoTitleAlias, VideoCategory, VideoYoutubeURL,
            VideoDescription, VideoTags, VideoMetaTitle
     FROM videos WHERE ${ACTIVE} AND VideoCategory = ?
     ORDER BY VideoCreated DESC LIMIT ? OFFSET ?`,
    [catId, limit, offset]
  );
}

export async function getVideoAlbums(parentId = 0) {
  return query<VideoCategory>(
    `SELECT VideoCategoryID, VideoCategoryTitle, VideoCategoryTitleAlias,
            VideoCategoryParentID, VideoCategoryHeaderImage, VideoCategoryImage
     FROM video_category WHERE ${CAT_ACTIVE} AND VideoCategoryParentID = ?
     ORDER BY VideoCategoryCreated DESC`,
    [parentId]
  );
}

export async function getVideos(catId = 0) {
  return query<CmsVideo>(
    `SELECT VideoID, VideoTitle, VideoTitleAlias, VideoCategory, VideoYoutubeURL,
            VideoDescription, VideoTags, VideoMetaTitle
     FROM videos WHERE ${ACTIVE} AND VideoCategory = ?
     ORDER BY VideoCreated DESC`,
    [catId]
  );
}
