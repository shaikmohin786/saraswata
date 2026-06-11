"use server";

import { revalidatePath, updateTag } from "next/cache";
import crypto from "crypto";
import { requireAuth } from "@/lib/admin/require-auth";
import { execute } from "@/lib/db/connection";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function revalidatePublic() {
  updateTag("cms-layout");
  revalidatePath("/", "layout");
}

async function userId() {
  const session = await requireAuth();
  return Number(session.user.id);
}

// ─── Posts ───────────────────────────────────────────
export async function savePost(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const description = String(formData.get("description") || "");
  const categoryId = Number(formData.get("categoryId") || 0);
  const image = String(formData.get("image") || "");
  const tags = String(formData.get("tags") || "");
  const videoUrl = String(formData.get("videoUrl") || "");
  const videoCode = String(formData.get("videoCode") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const publishedDate = String(formData.get("publishedDate") || "");
  const status = Number(formData.get("status") || 0);
  const pubDate = publishedDate ? new Date(publishedDate) : new Date();
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE posts SET PostTitle=?, PostTitleAlias=?, PostDescription=?, PostCategoryID=?,
       PostImage=?, PostVideoURL=?, PostVideoCode=?, PostTags=?, PostMetaTitle=?, PostMetaDescription=?,
       PostMetaKeywords=?, PostPublishedDate=?, PostStatus=?, PostModified=?, PostModifiedBy=? WHERE PostID=?`,
      [title, alias, description, categoryId, image, videoUrl, videoCode, tags, metaTitle, metaDescription,
        metaKeywords, pubDate, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO posts (PostCategoryID, PostTitle, PostTitleAlias, PostDescription, PostImage,
        PostVideoURL, PostVideoCode, PostTags, PostMetaTitle, PostMetaDescription, PostMetaKeywords,
        PostPublishedDate, PostViews, PostStatus, PostDelete, PostCreated, PostCreatedBy, PostModified, PostModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,?,0,?,?,?,?)`,
      [categoryId, title, alias, description, image, videoUrl, videoCode, tags, metaTitle, metaDescription,
        metaKeywords, pubDate, status, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/posts");
  revalidatePath(`/${alias}`);
  return { success: true };
}

export async function deletePost(id: number) {
  await userId();
  await execute("UPDATE posts SET PostDelete=1, PostModified=NOW() WHERE PostID=?", [id]);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/trash");
  return { success: true };
}

// ─── Pages ───────────────────────────────────────────
export async function savePage(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const description = String(formData.get("description") || "");
  const image = String(formData.get("image") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const status = Number(formData.get("status") || 0);
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE pages SET PageTitle=?, PageTitleAlias=?, PageDescription=?, PageImage=?,
       PageMetaTitle=?, PageMetaDescription=?, PageMetaKeywords=?, PageStatus=?, PageModified=?, PageModifiedBy=? WHERE PageID=?`,
      [title, alias, description, image, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO pages (PageTitle, PageTitleAlias, PageDescription, PageMetaTitle, PageMetaDescription,
        PageMetaKeywords, PageImage, PageViews, PageStatus, PageDelete, PageCreated, PageCreatedBy, PageModified, PageModifiedBy)
       VALUES (?,?,?,?,?,?,?,0,?,0,?,?,?,?)`,
      [title, alias, description, metaTitle, metaDescription, metaKeywords, image, status, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/page/" + alias);
  return { success: true };
}

export async function deletePage(id: number) {
  await userId();
  await execute("UPDATE pages SET PageDelete=1, PageModified=NOW() WHERE PageID=?", [id]);
  revalidatePath("/admin/pages");
  return { success: true };
}

// ─── Gallery ─────────────────────────────────────────
export async function saveGallery(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const description = String(formData.get("description") || "");
  const categoryId = Number(formData.get("categoryId") || 0);
  const image = String(formData.get("image") || "");
  const tags = String(formData.get("tags") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const status = Number(formData.get("status") || 0);
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE gallery SET GalleryTitle=?, GalleryTitleAlias=?, GalleryDescription=?, GalleryCategory=?,
       GalleryImage=?, GalleryTags=?, GalleryMetaTitle=?, GalleryMetaDescription=?, GalleryMetaKeywords=?,
       GalleryStatus=?, GalleryModified=?, GalleryModifiedBy=? WHERE GalleryID=?`,
      [title, alias, description, categoryId, image, tags, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO gallery (GalleryTitle, GalleryTitleAlias, GalleryCategory, GalleryImage, GalleryTags,
        GalleryDescription, GalleryMetaTitle, GalleryMetaDescription, GalleryMetaKeywords,
        GalleryStatus, GalleryDelete, GalleryCreated, GalleryCreatedBy, GalleryModified, GalleryModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,?,?,0,?,?,?,?)`,
      [title, alias, categoryId, image, tags, description, metaTitle, metaDescription, metaKeywords, status, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGallery(id: number) {
  await userId();
  await execute("UPDATE gallery SET GalleryDelete=1, GalleryModified=NOW() WHERE GalleryID=?", [id]);
  revalidatePath("/admin/gallery");
  return { success: true };
}

// ─── Videos ──────────────────────────────────────────
export async function saveVideo(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const description = String(formData.get("description") || "");
  const categoryId = Number(formData.get("categoryId") || 0);
  const youtubeUrl = String(formData.get("youtubeUrl") || "");
  const tags = String(formData.get("tags") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const status = Number(formData.get("status") || 0);
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE videos SET VideoTitle=?, VideoTitleAlias=?, VideoDescription=?, VideoCategory=?,
       VideoYoutubeURL=?, VideoTags=?, VideoMetaTitle=?, VideoMetaDescription=?, VideoMetaKeywords=?,
       VideoStatus=?, VideoModified=?, VideoModifiedBy=? WHERE VideoID=?`,
      [title, alias, description, categoryId, youtubeUrl, tags, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO videos (VideoTitle, VideoTitleAlias, VideoCategory, VideoYoutubeURL, VideoTags,
        VideoDescription, VideoMetaTitle, VideoMetaDescription, VideoMetaKeywords,
        VideoStatus, VideoDelete, VideoCreated, VideoCreatedBy, VideoModified, VideoModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,?,?,0,?,?,?,?)`,
      [title, alias, categoryId, youtubeUrl, tags, description, metaTitle, metaDescription, metaKeywords, status, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/videos");
  return { success: true };
}

export async function deleteVideo(id: number) {
  await userId();
  await execute("UPDATE videos SET VideoDelete=1, VideoModified=NOW() WHERE VideoID=?", [id]);
  revalidatePath("/admin/videos");
  return { success: true };
}

// ─── Categories ──────────────────────────────────────
export async function savePostCategory(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const parentId = Number(formData.get("parentId") || 0);
  const image = String(formData.get("image") || "");
  const headerImage = String(formData.get("headerImage") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const ordering = Number(formData.get("ordering") || 0);
  const status = Number(formData.get("status") || 0);
  const level = parentId ? 1 : 0;
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE posts_category SET PostCategoryTitle=?, PostCategoryTitleAlias=?, PostCategoryParentID=?,
       PostCategoryLevel=?, PostCategoryHeaderImage=?, PostCategoryImage=?, PostCategoryOrdering=?,
       PostCategoryMetaTitle=?, PostCategoryMetaDescription=?, PostCategoryMetaKeywords=?,
       PostCategoryStatus=?, PostCategoryModified=?, PostCategoryModifiedBy=? WHERE PostCategoryID=?`,
      [title, alias, parentId, level, headerImage, image, ordering, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO posts_category (PostCategoryTitle, PostCategoryTitleAlias, PostCategoryParentID, PostCategoryLevel,
        PostCategoryHeaderImage, PostCategoryImage, PostCategoryOrdering, PostCategoryStatus, PostCategoryDelete,
        PostCategoryMetaTitle, PostCategoryMetaDescription, PostCategoryMetaKeywords,
        PostCategoryCreated, PostCategoryCreatedBy, PostCategoryModified, PostCategoryModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,?)`,
      [title, alias, parentId, level, headerImage, image, ordering, status, metaTitle, metaDescription, metaKeywords, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/posts");
  return { success: true };
}

export async function deletePostCategory(id: number) {
  await userId();
  await execute("UPDATE posts_category SET PostCategoryDelete=1, PostCategoryModified=NOW() WHERE PostCategoryID=?", [id]);
  revalidatePath("/admin/posts/categories");
  return { success: true };
}

export async function saveGalleryCategory(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const parentId = Number(formData.get("parentId") || 0);
  const image = String(formData.get("image") || "");
  const headerImage = String(formData.get("headerImage") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const ordering = Number(formData.get("ordering") || 0);
  const status = Number(formData.get("status") || 0);
  const level = parentId ? 1 : 0;
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE gallery_category SET GalleryCategoryTitle=?, GalleryCategoryTitleAlias=?, GalleryCategoryParentID=?,
       GalleryCategoryCategoryLevel=?, GalleryCategoryHeaderImage=?, GalleryCategoryImage=?, GalleryCategoryOrdering=?,
       GalleryCategoryMetaTitle=?, GalleryCategoryMetaDescription=?, GalleryCategoryMetaKeywords=?,
       GalleryCategoryStatus=?, GalleryCategoryModified=?, GalleryCategoryModifiedBy=? WHERE GalleryCategoryID=?`,
      [title, alias, parentId, level, headerImage, image, ordering, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO gallery_category (GalleryCategoryTitle, GalleryCategoryTitleTelugu, GalleryCategoryTitleAlias,
        GalleryCategoryParentID, GalleryCategoryCategoryLevel, GalleryCategoryHeaderImage, GalleryCategoryImage,
        GalleryCategoryOrdering, GalleryCategoryStatus, GalleryCategoryDelete,
        GalleryCategoryMetaTitle, GalleryCategoryMetaDescription, GalleryCategoryMetaKeywords,
        GalleryCategoryCreated, GalleryCategoryCreatedBy, GalleryCategoryModified, GalleryCategoryModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,?)`,
      [title, title, alias, parentId, level, headerImage, image, ordering, status, metaTitle, metaDescription, metaKeywords, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryCategory(id: number) {
  await userId();
  await execute("UPDATE gallery_category SET GalleryCategoryDelete=1 WHERE GalleryCategoryID=?", [id]);
  revalidatePath("/admin/gallery/categories");
  return { success: true };
}

export async function saveVideoCategory(formData: FormData) {
  const uid = await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const alias = String(formData.get("alias") || slugify(title)).trim();
  const parentId = Number(formData.get("parentId") || 0);
  const image = String(formData.get("image") || "");
  const headerImage = String(formData.get("headerImage") || "");
  const metaTitle = String(formData.get("metaTitle") || title);
  const metaDescription = String(formData.get("metaDescription") || "");
  const metaKeywords = String(formData.get("metaKeywords") || "");
  const ordering = Number(formData.get("ordering") || 0);
  const status = Number(formData.get("status") || 0);
  const level = parentId ? 1 : 0;
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE video_category SET VideoCategoryTitle=?, VideoCategoryTitleAlias=?, VideoCategoryParentID=?,
       VideoCategoryCategoryLevel=?, VideoCategoryHeaderImage=?, VideoCategoryImage=?, VideoCategoryOrdering=?,
       VideoCategoryMetaTitle=?, VideoCategoryMetaDescription=?, VideoCategoryMetaKeywords=?,
       VideoCategoryStatus=?, VideoCategoryModified=?, VideoCategoryModifiedBy=? WHERE VideoCategoryID=?`,
      [title, alias, parentId, level, headerImage, image, ordering, metaTitle, metaDescription, metaKeywords, status, now, uid, id]
    );
  } else {
    await execute(
      `INSERT INTO video_category (VideoCategoryTitle, VideoCategoryTitleAlias, VideoCategoryParentID,
        VideoCategoryCategoryLevel, VideoCategoryHeaderImage, VideoCategoryImage, VideoCategoryOrdering,
        VideoCategoryStatus, VideoCategoryDelete, VideoCategoryMetaTitle, VideoCategoryMetaDescription,
        VideoCategoryMetaKeywords, VideoCategoryCreated, VideoCategoryCreatedBy, VideoCategoryModified, VideoCategoryModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,?)`,
      [title, alias, parentId, level, headerImage, image, ordering, status, metaTitle, metaDescription, metaKeywords, now, uid, now, uid]
    );
  }
  revalidatePublic();
  revalidatePath("/videos");
  return { success: true };
}

export async function deleteVideoCategory(id: number) {
  await userId();
  await execute("UPDATE video_category SET VideoCategoryDelete=1 WHERE VideoCategoryID=?", [id]);
  revalidatePath("/admin/videos/categories");
  return { success: true };
}

// ─── Menu ────────────────────────────────────────────
export async function saveMenuItem(formData: FormData) {
  await userId();
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") || "").trim();
  const parentId = Number(formData.get("parentId") || 0);
  const menuType = String(formData.get("menuType") || "Internal");
  const parameter = String(formData.get("parameter") || "");
  const slug = String(formData.get("slug") || "");
  const postType = Number(formData.get("postType") || 0);
  const postId = Number(formData.get("postId") || 0);
  const status = Number(formData.get("status") || 0);
  const ordering = Number(formData.get("ordering") || 0);
  const now = new Date();

  if (!title) return { error: "Title is required" };

  if (id) {
    await execute(
      `UPDATE menu_list SET MenuTitle=?, MenuParentID=?, MenuType=?, MenuPostType=?, MenuParameter=?, MenuSlug=?,
       MenuPostID=?, MenuStatus=?, MenuOrdering=?, MenuModified=?, MenuModifiedBy=? WHERE MenuID=?`,
      [title, parentId, menuType, postType, parameter, slug, postId, status, ordering, now, 1, id]
    );
  } else {
    await execute(
      `INSERT INTO menu_list (MenuTitle, MenuParentID, MenuType, MenuPostType, MenuParameter, MenuSlug,
        MenuPostID, MenuStatus, MenuDelete, MenuOrdering, MenuGroup, MenuCreated, MenuCreatedBy, MenuModified, MenuModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,0,?,1,?,?,?,1)`,
      [title, parentId, menuType, postType, parameter, slug, postId, status, ordering, now, 1, now]
    );
  }
  revalidatePublic();
  return { success: true };
}

export async function deleteMenuItem(id: number) {
  await userId();
  await execute("UPDATE menu_list SET MenuDelete=1 WHERE MenuID=?", [id]);
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { success: true };
}

export async function reorderMenuItem(id: number, direction: "up" | "down") {
  await userId();
  const { query: q } = await import("@/lib/db/connection");
  const rows = await q<{ MenuID: number; MenuOrdering: number }>(
    "SELECT MenuID, MenuOrdering FROM menu_list WHERE MenuDelete=0 ORDER BY MenuOrdering ASC"
  );
  const idx = rows.findIndex((r) => r.MenuID === id);
  if (idx < 0) return { error: "Item not found" };
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return { success: true };

  const current = rows[idx];
  const swap = rows[swapIdx];
  await execute("UPDATE menu_list SET MenuOrdering=? WHERE MenuID=?", [swap.MenuOrdering, current.MenuID]);
  await execute("UPDATE menu_list SET MenuOrdering=? WHERE MenuID=?", [current.MenuOrdering, swap.MenuID]);
  revalidatePublic();
  revalidatePath("/admin/menu");
  return { success: true };
}

// ─── Sliders ─────────────────────────────────────────
export async function saveSlider(formData: FormData) {
  await userId();
  const id = Number(formData.get("id") || 0);
  const now = new Date();
  const fields = [1, 2, 3, 4, 5].map((n) => ({
    image: String(formData.get(`image${n}`) || ""),
    text: String(formData.get(`text${n}`) || ""),
  }));

  if (id) {
    await execute(
      `UPDATE sliders SET SliderImage1=?, SliderText1=?, SliderImage2=?, SliderText2=?,
       SliderImage3=?, SliderText3=?, SliderImage4=?, SliderText4=?,
       SliderImage5=?, SliderText5=?, SliderModified=?, SliderModifiedBy=? WHERE SliderID=?`,
      [
        fields[0].image, fields[0].text, fields[1].image, fields[1].text,
        fields[2].image, fields[2].text, fields[3].image, fields[3].text,
        fields[4].image, fields[4].text, now, 1, id,
      ]
    );
  } else {
    await execute(
      `INSERT INTO sliders (SliderImage1, SliderText1, SliderImage2, SliderText2, SliderImage3, SliderText3,
        SliderImage4, SliderText4, SliderImage5, SliderText5, SliderDelete, SliderCreated, SliderCreatedBy, SliderModified, SliderModifiedBy)
       VALUES (?,?,?,?,?,?,?,?,?,?,0,?,?,?,1)`,
      [
        fields[0].image, fields[0].text, fields[1].image, fields[1].text,
        fields[2].image, fields[2].text, fields[3].image, fields[3].text,
        fields[4].image, fields[4].text, now, 1, now,
      ]
    );
  }
  revalidatePublic();
  return { success: true };
}

// ─── Settings ────────────────────────────────────────
export async function saveSettings(formData: FormData) {
  await userId();
  await execute(
    `UPDATE global_settings SET
      ConfigSiteName=?, ConfigContent=?, ConfigFooterText=?, ConfigContact=?, ConfigWorkingHours=?,
      ConfigMaps=?, ConfigSiteLogo=?, ConfigDefaultTitle=?, ConfigDefaultDescription=?, ConfigDefaultKeywords=?,
      ConfigAnalyticsCode=?, ConfigFBURL=?, ConfigTwitterURL=?, ConfigLinkedinURL=?, ConfigInstagramURL=?,
      ConfigYoutubeURL=?, ConfigPinterestURL=?, ConfigPostsImage=?, ConfigGalleryImage=?, ConfigVideosImage=?,
      ConfigModified=NOW() LIMIT 1`,
    [
      String(formData.get("siteName") || ""),
      String(formData.get("content") || ""),
      String(formData.get("footerText") || ""),
      String(formData.get("contact") || ""),
      String(formData.get("workingHours") || ""),
      String(formData.get("maps") || ""),
      String(formData.get("logo") || ""),
      String(formData.get("defaultTitle") || ""),
      String(formData.get("defaultDescription") || ""),
      String(formData.get("defaultKeywords") || ""),
      String(formData.get("analyticsCode") || ""),
      String(formData.get("fbUrl") || ""),
      String(formData.get("twitterUrl") || ""),
      String(formData.get("linkedinUrl") || ""),
      String(formData.get("instagramUrl") || ""),
      String(formData.get("youtubeUrl") || ""),
      String(formData.get("pinterestUrl") || ""),
      String(formData.get("postsBanner") || ""),
      String(formData.get("galleryBanner") || ""),
      String(formData.get("videosBanner") || ""),
    ]
  );
  revalidatePublic();
  revalidatePath("/admin/settings");
  return { success: true };
}

// ─── Users ───────────────────────────────────────────
export async function saveUser(formData: FormData) {
  await userId();
  const id = Number(formData.get("id") || 0);
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const role = Number(formData.get("role") || 1);
  const status = Number(formData.get("status") ?? 0);
  const now = new Date();

  if (id) {
    if (password) {
      const md5 = crypto.createHash("md5").update(password).digest("hex");
      await execute(
        `UPDATE users SET UserFirstName=?, UserLastName=?, UserEmailID=?, UserPassword=?, UserRole=?, UserStatus=?, UserModified=? WHERE UserID=?`,
        [firstName, lastName, email, md5, role, status, now, id]
      );
    } else {
      await execute(
        `UPDATE users SET UserFirstName=?, UserLastName=?, UserEmailID=?, UserRole=?, UserStatus=?, UserModified=? WHERE UserID=?`,
        [firstName, lastName, email, role, status, now, id]
      );
    }
  } else {
    if (!password) return { error: "Password required for new user" };
    const md5 = crypto.createHash("md5").update(password).digest("hex");
    await execute(
      `INSERT INTO users (UserName, UserFirstName, UserLastName, UserEmailID, UserPassword, UserMD5Hash,
        UserPhone, UserRole, UserGender, UserProfilePic, UserStatus, UserDelete, UserCreated, UserCreatedBy, UserModified, UserModifiedBy)
       VALUES (?,?,?,?,?,'','',?,0,'',?,0,?,?,?,1)`,
      [email, firstName, lastName, email, md5, role, status, now, 1, now]
    );
  }
  return { success: true };
}

export async function deleteUser(id: number) {
  await userId();
  await execute("UPDATE users SET UserDelete=1 WHERE UserID=?", [id]);
  return { success: true };
}

// ─── Profile ─────────────────────────────────────────
export async function saveProfile(formData: FormData) {
  const session = await requireAuth();
  const uid = Number(session.user.id);
  const firstName = String(formData.get("firstName") || "");
  const lastName = String(formData.get("lastName") || "");
  const phone = String(formData.get("phone") || "");
  const password = String(formData.get("password") || "");
  const now = new Date();

  if (password) {
    const md5 = crypto.createHash("md5").update(password).digest("hex");
    await execute(
      "UPDATE users SET UserFirstName=?, UserLastName=?, UserPhone=?, UserPassword=?, UserModified=? WHERE UserID=?",
      [firstName, lastName, phone, md5, now, uid]
    );
  } else {
    await execute(
      "UPDATE users SET UserFirstName=?, UserLastName=?, UserPhone=?, UserModified=? WHERE UserID=?",
      [firstName, lastName, phone, now, uid]
    );
  }
  return { success: true };
}

// ─── Trash ───────────────────────────────────────────
export async function restoreTrash(type: string, id: number) {
  await userId();
  const tables: Record<string, { table: string; col: string; idCol: string }> = {
    post: { table: "posts", col: "PostDelete", idCol: "PostID" },
    page: { table: "pages", col: "PageDelete", idCol: "PageID" },
    gallery: { table: "gallery", col: "GalleryDelete", idCol: "GalleryID" },
    video: { table: "videos", col: "VideoDelete", idCol: "VideoID" },
    post_category: { table: "posts_category", col: "PostCategoryDelete", idCol: "PostCategoryID" },
    gallery_category: { table: "gallery_category", col: "GalleryCategoryDelete", idCol: "GalleryCategoryID" },
    video_category: { table: "video_category", col: "VideoCategoryDelete", idCol: "VideoCategoryID" },
  };
  const t = tables[type];
  if (!t) return { error: "Invalid type" };
  await execute(`UPDATE ${t.table} SET ${t.col}=0 WHERE ${t.idCol}=?`, [id]);
  revalidatePath("/admin/trash");
  revalidatePublic();
  return { success: true };
}

export async function permanentDelete(type: string, id: number) {
  await userId();
  const tables: Record<string, { table: string; idCol: string }> = {
    post: { table: "posts", idCol: "PostID" },
    page: { table: "pages", idCol: "PageID" },
    gallery: { table: "gallery", idCol: "GalleryID" },
    video: { table: "videos", idCol: "VideoID" },
    post_category: { table: "posts_category", idCol: "PostCategoryID" },
    gallery_category: { table: "gallery_category", idCol: "GalleryCategoryID" },
    video_category: { table: "video_category", idCol: "VideoCategoryID" },
  };
  const t = tables[type];
  if (!t) return { error: "Invalid type" };
  await execute(`DELETE FROM ${t.table} WHERE ${t.idCol}=?`, [id]);
  revalidatePath("/admin/trash");
  return { success: true };
}

// ─── Data fixes ──────────────────────────────────────
export async function fixLegacyData() {
  await userId();
  await execute("UPDATE pages SET PageDelete=0 WHERE PageTitleAlias='contact-us'");
  await execute(
    "UPDATE menu_list SET MenuPostType=2, MenuParameter='page/', MenuSlug='collection-of-books', MenuPostID=18 WHERE MenuID=44"
  );
  // Hide menu items with no assigned content (were routing to homepage)
  await execute("UPDATE menu_list SET MenuDelete=1 WHERE MenuID IN (45, 46)");
  revalidatePublic();
  return { success: true, message: "Legacy data fixes applied successfully." };
}
