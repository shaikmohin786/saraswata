import { query, queryOne } from "@/lib/db/connection";

export type AdminPostCategoryRow = {
  PostCategoryID: number;
  PostCategoryTitle: string;
  PostCategoryTitleAlias: string;
  PostCategoryParentID: number;
  PostCategoryStatus: number;
  PostCategoryOrdering: number;
};

export type AdminGalleryCategoryRow = {
  GalleryCategoryID: number;
  GalleryCategoryTitle: string;
  GalleryCategoryTitleAlias: string;
  GalleryCategoryParentID: number;
  GalleryCategoryStatus: number;
  GalleryCategoryOrdering: number;
};

export type AdminVideoCategoryRow = {
  VideoCategoryID: number;
  VideoCategoryTitle: string;
  VideoCategoryTitleAlias: string;
  VideoCategoryParentID: number;
  VideoCategoryStatus: number;
  VideoCategoryOrdering: number;
};

export async function getAdminPostCategories() {
  return query<AdminPostCategoryRow>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryStatus, PostCategoryOrdering
     FROM posts_category WHERE PostCategoryDelete = 0 ORDER BY PostCategoryOrdering ASC`
  );
}

export async function getAdminPostCategory(id: number) {
  return queryOne("SELECT * FROM posts_category WHERE PostCategoryID = ? LIMIT 1", [id]);
}

export async function getAdminGalleryCategories() {
  return query<AdminGalleryCategoryRow>(
    `SELECT GalleryCategoryID, GalleryCategoryTitle, GalleryCategoryTitleAlias, GalleryCategoryParentID,
            GalleryCategoryStatus, GalleryCategoryOrdering
     FROM gallery_category WHERE GalleryCategoryDelete = 0 ORDER BY GalleryCategoryOrdering ASC`
  );
}

export async function getAdminGalleryCategory(id: number) {
  return queryOne("SELECT * FROM gallery_category WHERE GalleryCategoryID = ? LIMIT 1", [id]);
}

export async function getAdminVideoCategories() {
  return query<AdminVideoCategoryRow>(
    `SELECT VideoCategoryID, VideoCategoryTitle, VideoCategoryTitleAlias, VideoCategoryParentID,
            VideoCategoryStatus, VideoCategoryOrdering
     FROM video_category WHERE VideoCategoryDelete = 0 ORDER BY VideoCategoryOrdering ASC`
  );
}

export async function getAdminVideoCategory(id: number) {
  return queryOne("SELECT * FROM video_category WHERE VideoCategoryID = ? LIMIT 1", [id]);
}
