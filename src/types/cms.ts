export type GlobalSettings = {
  ConfigID: number;
  ConfigSiteName: string;
  ConfigSiteLogo: string;
  ConfigFooterText: string;
  ConfigContent: string;
  ConfigDefaultTitle: string;
  ConfigDefaultDescription: string;
  ConfigDefaultKeywords: string;
  ConfigAnalyticsCode: string;
  ConfigFBURL: string;
  ConfigTwitterURL: string;
  ConfigLinkedinURL: string;
  ConfigInstagramURL: string;
  ConfigYoutubeURL: string;
  ConfigPinterestURL: string;
  ConfigMaps: string;
  ConfigWorkingHours: string;
  ConfigContact: string;
  ConfigPostsImage: string;
  ConfigGalleryImage: string;
  ConfigVideosImage: string;
};

export type MenuListItem = {
  MenuID: number;
  MenuTitle: string;
  MenuParentID: number;
  MenuType: string;
  MenuPostType: number;
  MenuParameter: string;
  MenuSlug: string;
  MenuPostID: number;
  MenuStatus: number;
  MenuDelete: number;
  MenuOrdering: number;
  MenuGroup: number;
};

export type CmsPost = {
  PostID: number;
  PostCategoryID: number;
  PostTitle: string;
  PostTitleAlias: string;
  PostDescription: string;
  PostImage: string;
  PostVideoCode?: string | null;
  PostTags: string;
  PostPublishedDate: string;
  PostMetaTitle: string;
  PostMetaDescription: string;
};

export type PostCategory = {
  PostCategoryID: number;
  PostCategoryTitle: string;
  PostCategoryTitleAlias: string;
  PostCategoryParentID: number;
  PostCategoryHeaderImage: string;
  PostCategoryImage: string;
};

export type CmsGallery = {
  GalleryID: number;
  GalleryTitle: string;
  GalleryTitleAlias: string;
  GalleryCategory: number;
  GalleryImage: string;
  GalleryDescription: string;
  GalleryTags: string;
  GalleryMetaTitle: string;
};

export type GalleryCategory = {
  GalleryCategoryID: number;
  GalleryCategoryTitle: string;
  GalleryCategoryTitleAlias: string;
  GalleryCategoryParentID: number;
  GalleryCategoryHeaderImage: string;
  GalleryCategoryImage: string;
};

export type CmsVideo = {
  VideoID: number;
  VideoTitle: string;
  VideoTitleAlias: string;
  VideoCategory: number;
  VideoYoutubeURL: string;
  VideoDescription: string;
  VideoTags: string;
  VideoMetaTitle: string;
};

export type VideoCategory = {
  VideoCategoryID: number;
  VideoCategoryTitle: string;
  VideoCategoryTitleAlias: string;
  VideoCategoryParentID: number;
  VideoCategoryHeaderImage: string;
  VideoCategoryImage: string;
};

export type CmsPage = {
  PageID: number;
  PageTitle: string;
  PageTitleAlias: string;
  PageDescription: string;
  PageImage: string;
  PageMetaTitle: string;
  PageMetaDescription: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
