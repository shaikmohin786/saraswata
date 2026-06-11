import { query, queryOne } from "@/lib/db/connection";

export type AdminPostRow = {
  PostID: number;
  PostTitle: string;
  PostTitleAlias: string;
  PostStatus: number;
  PostDelete: number;
  PostCreated: string;
  PostCategoryTitle: string | null;
};

export type AdminPageRow = {
  PageID: number;
  PageTitle: string;
  PageTitleAlias: string;
  PageStatus: number;
  PageDelete: number;
  PageCreated: string;
};

export type AdminGalleryRow = {
  GalleryID: number;
  GalleryTitle: string;
  GalleryTitleAlias: string;
  GalleryStatus: number;
  GalleryDelete: number;
  GalleryCategoryTitle: string | null;
};

export type AdminVideoRow = {
  VideoID: number;
  VideoTitle: string;
  VideoTitleAlias: string;
  VideoStatus: number;
  VideoDelete: number;
  VideoCategoryTitle: string | null;
};

export type AdminMenuRow = {
  MenuID: number;
  MenuTitle: string;
  MenuParentID: number;
  MenuType: string;
  MenuParameter: string;
  MenuSlug: string;
  MenuStatus: number;
  MenuOrdering: number;
};

export type TrashRow = {
  id: number;
  title: string;
  type: string;
  deleted: string;
};

export async function getDashboardStats() {
  const [posts, pages, gallery, videos, users, trash] = await Promise.all([
    queryOne<{ c: number }>("SELECT COUNT(*) as c FROM posts WHERE PostDelete=0"),
    queryOne<{ c: number }>("SELECT COUNT(*) as c FROM pages WHERE PageDelete=0"),
    queryOne<{ c: number }>("SELECT COUNT(*) as c FROM gallery WHERE GalleryDelete=0"),
    queryOne<{ c: number }>("SELECT COUNT(*) as c FROM videos WHERE VideoDelete=0"),
    queryOne<{ c: number }>("SELECT COUNT(*) as c FROM users WHERE UserDelete=0"),
    queryOne<{ c: number }>(
      `SELECT (
        (SELECT COUNT(*) FROM posts WHERE PostDelete=1) +
        (SELECT COUNT(*) FROM pages WHERE PageDelete=1) +
        (SELECT COUNT(*) FROM gallery WHERE GalleryDelete=1) +
        (SELECT COUNT(*) FROM videos WHERE VideoDelete=1)
      ) as c`
    ),
  ]);
  return {
    posts: posts?.c ?? 0,
    pages: pages?.c ?? 0,
    gallery: gallery?.c ?? 0,
    videos: videos?.c ?? 0,
    users: users?.c ?? 0,
    trash: trash?.c ?? 0,
  };
}

export async function getAdminPosts() {
  return query<AdminPostRow>(
    `SELECT p.PostID, p.PostTitle, p.PostTitleAlias, p.PostStatus, p.PostDelete, p.PostCreated,
            c.PostCategoryTitle
     FROM posts p LEFT JOIN posts_category c ON p.PostCategoryID = c.PostCategoryID
     WHERE p.PostDelete = 0 ORDER BY p.PostCreated DESC`
  );
}

export async function getAdminPost(id: number) {
  return queryOne("SELECT * FROM posts WHERE PostID = ? LIMIT 1", [id]);
}

export async function getAdminPages() {
  return query<AdminPageRow>(
    "SELECT PageID, PageTitle, PageTitleAlias, PageStatus, PageDelete, PageCreated FROM pages WHERE PageDelete=0 ORDER BY PageCreated DESC"
  );
}

export async function getAdminPage(id: number) {
  return queryOne("SELECT * FROM pages WHERE PageID = ? LIMIT 1", [id]);
}

export async function getAdminGalleries() {
  return query<AdminGalleryRow>(
    `SELECT g.GalleryID, g.GalleryTitle, g.GalleryTitleAlias, g.GalleryStatus, g.GalleryDelete,
            c.GalleryCategoryTitle
     FROM gallery g LEFT JOIN gallery_category c ON g.GalleryCategory = c.GalleryCategoryID
     WHERE g.GalleryDelete = 0 ORDER BY g.GalleryCreated DESC`
  );
}

export async function getAdminGallery(id: number) {
  return queryOne("SELECT * FROM gallery WHERE GalleryID = ? LIMIT 1", [id]);
}

export async function getAdminVideos() {
  return query<AdminVideoRow>(
    `SELECT v.VideoID, v.VideoTitle, v.VideoTitleAlias, v.VideoStatus, v.VideoDelete,
            c.VideoCategoryTitle
     FROM videos v LEFT JOIN video_category c ON v.VideoCategory = c.VideoCategoryID
     WHERE v.VideoDelete = 0 ORDER BY v.VideoCreated DESC`
  );
}

export async function getAdminVideo(id: number) {
  return queryOne("SELECT * FROM videos WHERE VideoID = ? LIMIT 1", [id]);
}

export async function getAdminMenuItems() {
  return query<AdminMenuRow>(
    "SELECT MenuID, MenuTitle, MenuParentID, MenuType, MenuParameter, MenuSlug, MenuStatus, MenuOrdering FROM menu_list WHERE MenuDelete=0 ORDER BY MenuOrdering ASC"
  );
}

export async function getAdminMenuItem(id: number) {
  return queryOne("SELECT * FROM menu_list WHERE MenuID = ? LIMIT 1", [id]);
}

export async function getGalleryCategories() {
  return query<{ GalleryCategoryID: number; GalleryCategoryTitle: string }>(
    "SELECT GalleryCategoryID, GalleryCategoryTitle FROM gallery_category WHERE GalleryCategoryDelete = 0 ORDER BY GalleryCategoryTitle ASC"
  );
}

export async function getVideoCategories() {
  return query<{ VideoCategoryID: number; VideoCategoryTitle: string }>(
    "SELECT VideoCategoryID, VideoCategoryTitle FROM video_category WHERE VideoCategoryDelete = 0 ORDER BY VideoCategoryTitle ASC"
  );
}

export type AdminSliderRow = {
  SliderID: number;
  SliderImage1: string;
  SliderText1: string;
  SliderImage2: string;
  SliderText2: string;
  SliderImage3: string;
  SliderText3: string;
  SliderImage4: string;
  SliderText4: string;
  SliderImage5: string;
  SliderText5: string;
};

export async function getAdminSliders() {
  return query<AdminSliderRow>("SELECT * FROM sliders WHERE SliderDelete=0 ORDER BY SliderID ASC");
}

export async function getAdminSlider(id: number) {
  return queryOne("SELECT * FROM sliders WHERE SliderID = ? LIMIT 1", [id]);
}

export async function getTrashItems() {
  const [posts, pages, gallery, videos, postCats, galleryCats, videoCats] = await Promise.all([
    query<TrashRow>("SELECT PostID as id, PostTitle as title, 'post' as type, PostModified as deleted FROM posts WHERE PostDelete=1"),
    query<TrashRow>("SELECT PageID as id, PageTitle as title, 'page' as type, PageModified as deleted FROM pages WHERE PageDelete=1"),
    query<TrashRow>("SELECT GalleryID as id, GalleryTitle as title, 'gallery' as type, GalleryModified as deleted FROM gallery WHERE GalleryDelete=1"),
    query<TrashRow>("SELECT VideoID as id, VideoTitle as title, 'video' as type, VideoModified as deleted FROM videos WHERE VideoDelete=1"),
    query<TrashRow>("SELECT PostCategoryID as id, PostCategoryTitle as title, 'post_category' as type, PostCategoryModified as deleted FROM posts_category WHERE PostCategoryDelete=1"),
    query<TrashRow>("SELECT GalleryCategoryID as id, GalleryCategoryTitle as title, 'gallery_category' as type, GalleryCategoryModified as deleted FROM gallery_category WHERE GalleryCategoryDelete=1"),
    query<TrashRow>("SELECT VideoCategoryID as id, VideoCategoryTitle as title, 'video_category' as type, VideoCategoryModified as deleted FROM video_category WHERE VideoCategoryDelete=1"),
  ]);
  return [...posts, ...pages, ...gallery, ...videos, ...postCats, ...galleryCats, ...videoCats];
}

export type SearchResult = {
  id: number;
  title: string;
  slug: string;
  type: "post" | "page" | "gallery" | "video";
};

export async function searchContent(term: string): Promise<SearchResult[]> {
  const like = `%${term}%`;
  const [posts, pages, gallery, videos] = await Promise.all([
    query(
      `SELECT PostID as id, PostTitle as title, PostTitleAlias as slug, 'post' as type
       FROM posts WHERE PostDelete=0 AND PostStatus=0 AND (PostTitle LIKE ? OR PostDescription LIKE ?) LIMIT 20`,
      [like, like]
    ),
    query(
      `SELECT PageID as id, PageTitle as title, PageTitleAlias as slug, 'page' as type
       FROM pages WHERE PageDelete=0 AND PageStatus=0 AND (PageTitle LIKE ? OR PageDescription LIKE ?) LIMIT 20`,
      [like, like]
    ),
    query(
      `SELECT GalleryID as id, GalleryTitle as title, GalleryTitleAlias as slug, 'gallery' as type
       FROM gallery WHERE GalleryDelete=0 AND GalleryStatus=0 AND GalleryTitle LIKE ? LIMIT 20`,
      [like]
    ),
    query<SearchResult>(
      `SELECT VideoID as id, VideoTitle as title, VideoTitleAlias as slug, 'video' as type
       FROM videos WHERE VideoDelete=0 AND VideoStatus=0 AND VideoTitle LIKE ? LIMIT 20`,
      [like]
    ),
  ]);
  return [...posts, ...pages, ...gallery, ...videos] as SearchResult[];
}
