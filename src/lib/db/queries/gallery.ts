import { cache } from "react";
import { query, queryOne } from "@/lib/db/connection";
import { buildAncestorsFromMap } from "@/lib/db/category-ancestors";
import type { CmsGallery, GalleryCategory } from "@/types/cms";

const ACTIVE = "GalleryStatus = 0 AND GalleryDelete = 0";
const CAT_ACTIVE = "GalleryCategoryStatus = 0 AND GalleryCategoryDelete = 0";

export async function getLatestGallery(limit = 4) {
  return query<CmsGallery>(
    `SELECT GalleryID, GalleryTitle, GalleryTitleAlias, GalleryCategory, GalleryImage,
            GalleryDescription, GalleryTags, GalleryMetaTitle
     FROM gallery WHERE ${ACTIVE} ORDER BY GalleryCreated DESC LIMIT ?`,
    [limit]
  );
}

export async function getAllGalleriesForHome() {
  return query<CmsGallery>(
    `SELECT GalleryID, GalleryTitle, GalleryTitleAlias, GalleryCategory, GalleryImage,
            GalleryDescription, GalleryTags, GalleryMetaTitle
     FROM gallery WHERE ${ACTIVE} ORDER BY GalleryCreated DESC`
  );
}

export async function getGalleryBySlug(slug: string) {
  return queryOne<CmsGallery>(
    `SELECT * FROM gallery WHERE ${ACTIVE} AND GalleryTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getGalleryCategoryBySlug(slug: string) {
  return queryOne<GalleryCategory>(
    `SELECT GalleryCategoryID, GalleryCategoryTitle, GalleryCategoryTitleAlias,
            GalleryCategoryParentID, GalleryCategoryHeaderImage, GalleryCategoryImage
     FROM gallery_category WHERE ${CAT_ACTIVE} AND GalleryCategoryTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getGalleryCategoryById(id: number) {
  return queryOne<GalleryCategory>(
    `SELECT GalleryCategoryID, GalleryCategoryTitle, GalleryCategoryTitleAlias,
            GalleryCategoryParentID, GalleryCategoryHeaderImage, GalleryCategoryImage
     FROM gallery_category WHERE GalleryCategoryID = ? LIMIT 1`,
    [id]
  );
}

const getGalleryCategoryMap = cache(async () => {
  const rows = await query<GalleryCategory>(
    `SELECT GalleryCategoryID, GalleryCategoryTitle, GalleryCategoryTitleAlias,
            GalleryCategoryParentID, GalleryCategoryHeaderImage, GalleryCategoryImage
     FROM gallery_category WHERE ${CAT_ACTIVE}`
  );
  return new Map(rows.map((r) => [r.GalleryCategoryID, r]));
});

export async function getGalleryCategoryAncestors(catId: number): Promise<GalleryCategory[]> {
  const map = await getGalleryCategoryMap();
  return buildAncestorsFromMap(catId, map, "GalleryCategoryID", "GalleryCategoryParentID");
}

export async function getGalleryAlbums(parentId = 0) {
  return query<GalleryCategory>(
    `SELECT GalleryCategoryID, GalleryCategoryTitle, GalleryCategoryTitleAlias,
            GalleryCategoryParentID, GalleryCategoryHeaderImage, GalleryCategoryImage
     FROM gallery_category WHERE ${CAT_ACTIVE} AND GalleryCategoryParentID = ?
     ORDER BY GalleryCategoryCreated DESC`,
    [parentId]
  );
}

export async function getGalleryCount(catId = 0) {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM gallery WHERE ${ACTIVE} AND GalleryCategory = ?`,
    [catId]
  );
  return row?.count ?? 0;
}

export async function getGalleries(catId = 0, limit = 12, offset = 0) {
  return query<CmsGallery>(
    `SELECT GalleryID, GalleryTitle, GalleryTitleAlias, GalleryCategory, GalleryImage,
            GalleryDescription, GalleryTags, GalleryMetaTitle
     FROM gallery WHERE ${ACTIVE} AND GalleryCategory = ?
     ORDER BY GalleryCreated DESC LIMIT ? OFFSET ?`,
    [catId, limit, offset]
  );
}

export async function getAdjacentGallery(galleryId: number, direction: "prev" | "next") {
  const op = direction === "prev" ? "<" : ">";
  const order = direction === "prev" ? "DESC" : "ASC";
  return queryOne<CmsGallery>(
    `SELECT GalleryID, GalleryTitle, GalleryTitleAlias FROM gallery
     WHERE ${ACTIVE} AND GalleryID ${op} ? ORDER BY GalleryID ${order} LIMIT 1`,
    [galleryId]
  );
}
