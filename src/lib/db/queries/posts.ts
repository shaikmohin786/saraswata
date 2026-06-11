import { cache } from "react";
import { query, queryOne } from "@/lib/db/connection";
import { buildAncestorsFromMap } from "@/lib/db/category-ancestors";
import type { CmsPost, PostCategory } from "@/types/cms";

const ACTIVE = "PostStatus = 0 AND PostDelete = 0";
const CAT_ACTIVE = "PostCategoryStatus = 0 AND PostCategoryDelete = 0";

export async function getLatestPosts(limit = 4) {
  return query<CmsPost>(
    `SELECT PostID, PostCategoryID, PostTitle, PostTitleAlias, PostDescription, PostImage,
            PostVideoCode, PostTags, PostPublishedDate, PostMetaTitle, PostMetaDescription
     FROM posts WHERE ${ACTIVE} ORDER BY PostCreated DESC LIMIT ?`,
    [limit]
  );
}

export async function getPostBySlug(slug: string) {
  return queryOne<CmsPost>(
    `SELECT * FROM posts WHERE ${ACTIVE} AND PostTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getPostCategoryBySlug(slug: string) {
  return queryOne<PostCategory>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryHeaderImage, PostCategoryImage
     FROM posts_category WHERE ${CAT_ACTIVE} AND PostCategoryTitleAlias = ? LIMIT 1`,
    [slug]
  );
}

export async function getPostCategoryById(id: number) {
  return queryOne<PostCategory>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryHeaderImage, PostCategoryImage
     FROM posts_category WHERE PostCategoryID = ? LIMIT 1`,
    [id]
  );
}

const getPostCategoryMap = cache(async () => {
  const rows = await query<PostCategory>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryHeaderImage, PostCategoryImage
     FROM posts_category WHERE ${CAT_ACTIVE}`
  );
  return new Map(rows.map((r) => [r.PostCategoryID, r]));
});

export async function getPostCategoryAncestors(catId: number): Promise<PostCategory[]> {
  const map = await getPostCategoryMap();
  return buildAncestorsFromMap(catId, map, "PostCategoryID", "PostCategoryParentID");
}

export async function getPostCategories(parentId = 0) {
  return query<PostCategory>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryHeaderImage, PostCategoryImage
     FROM posts_category WHERE ${CAT_ACTIVE} AND PostCategoryParentID = ?
     ORDER BY PostCategoryOrdering ASC`,
    [parentId]
  );
}

export async function getAllPostCategoriesFlat() {
  return query<PostCategory & { depth: number }>(
    `SELECT PostCategoryID, PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID,
            PostCategoryHeaderImage, PostCategoryImage, PostCategoryLevel as depth
     FROM posts_category WHERE ${CAT_ACTIVE} ORDER BY PostCategoryOrdering ASC`
  );
}

export async function getPostsCount(catId = 0) {
  const row = await queryOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM posts WHERE ${ACTIVE} AND PostCategoryID = ?`,
    [catId]
  );
  return row?.count ?? 0;
}

export async function getPosts(catId = 0, limit = 10, offset = 0) {
  return query<CmsPost>(
    `SELECT PostID, PostCategoryID, PostTitle, PostTitleAlias, PostDescription, PostImage,
            PostVideoCode, PostTags, PostPublishedDate, PostMetaTitle, PostMetaDescription
     FROM posts WHERE ${ACTIVE} AND PostCategoryID = ?
     ORDER BY PostCreated DESC LIMIT ? OFFSET ?`,
    [catId, limit, offset]
  );
}

export async function getRelatedPosts(
  postId: number,
  categoryId: number,
  limit = 5
) {
  return query<CmsPost>(
    `SELECT PostID, PostCategoryID, PostTitle, PostTitleAlias, PostDescription, PostImage,
            PostPublishedDate
     FROM posts
     WHERE ${ACTIVE} AND PostID != ? AND PostCategoryID = ?
     ORDER BY PostPublishedDate DESC LIMIT ?`,
    [postId, categoryId, limit]
  );
}

export async function getAdjacentPost(postId: number, direction: "prev" | "next") {
  const op = direction === "prev" ? "<" : ">";
  const order = direction === "prev" ? "DESC" : "ASC";
  return queryOne<CmsPost>(
    `SELECT PostID, PostTitle, PostTitleAlias FROM posts
     WHERE ${ACTIVE} AND PostID ${op} ? ORDER BY PostID ${order} LIMIT 1`,
    [postId]
  );
}
