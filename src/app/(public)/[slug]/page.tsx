import { notFound } from "next/navigation";
import { ArticleDetail } from "@/components/public/shared/ArticleDetail";
import {
  getAdjacentPost,
  getPostBySlug,
  getPostCategoryAncestors,
  getPostCategoryById,
  getRelatedPosts,
} from "@/lib/db/queries/posts";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { youtubeEmbedUrl } from "@/lib/youtube";
import type { BreadcrumbItem } from "@/types/cms";

const RESERVED = new Set([
  "posts",
  "gallery",
  "videos",
  "page",
  "search",
  "admin",
  "api",
  "_next",
]);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  const post = await getPostBySlug(slug);
  return { title: post?.PostMetaTitle || post?.PostTitle || "Post" };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const category = await getPostCategoryById(post.PostCategoryID);
  const ancestors = category
    ? await getPostCategoryAncestors(category.PostCategoryID)
    : [];

  const [prev, next, related] = await Promise.all([
    getAdjacentPost(post.PostID, "prev"),
    getAdjacentPost(post.PostID, "next"),
    getRelatedPosts(post.PostID, post.PostCategoryID),
  ]);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    ...ancestors.map((a) => ({
      label: a.PostCategoryTitle,
      href: `/posts/${a.PostCategoryTitleAlias}`,
    })),
    ...(category
      ? [{ label: category.PostCategoryTitle, href: `/posts/${category.PostCategoryTitleAlias}` }]
      : []),
    { label: post.PostTitle },
  ];

  const videoUrl = post.PostVideoCode
    ? youtubeEmbedUrl(`https://www.youtube.com/watch?v=${post.PostVideoCode}`)
    : null;

  return (
    <ArticleDetail
      title={post.PostTitle}
      breadcrumbs={breadcrumbs}
      imageUrl={resolveMediaUrl("posts", post.PostImage)}
      html={post.PostDescription}
      date={post.PostPublishedDate}
      videoEmbedUrl={videoUrl}
      prev={
        prev
          ? { title: prev.PostTitle, href: `/${prev.PostTitleAlias}` }
          : null
      }
      next={
        next
          ? { title: next.PostTitle, href: `/${next.PostTitleAlias}` }
          : null
      }
      related={related.map((r) => ({
        title: r.PostTitle,
        href: `/${r.PostTitleAlias}`,
      }))}
    />
  );
}
