import { notFound } from "next/navigation";
import { PageShell } from "@/components/public/shared/PageShell";
import { Pagination } from "@/components/public/shared/Pagination";
import { CategorySelect } from "@/components/public/shared/CategorySelect";
import { PostCardGrid } from "@/components/public/shared/PostCardGrid";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import {
  getAllPostCategoriesFlat,
  getPostCategoryAncestors,
  getPostCategoryBySlug,
  getPosts,
  getPostsCount,
} from "@/lib/db/queries/posts";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import type { BreadcrumbItem } from "@/types/cms";

const PER_PAGE = 10;

type Props = {
  params: Promise<{ segments?: string[] }>;
};

function parseSegments(segments?: string[]) {
  if (!segments || segments.length === 0) {
    return { categorySlug: undefined, page: 1 };
  }
  if (segments.length === 1) {
    return { categorySlug: segments[0], page: 1 };
  }
  const page = parseInt(segments[1], 10);
  if (isNaN(page) || page < 1) notFound();
  return { categorySlug: segments[0], page };
}

export async function generateMetadata({ params }: Props) {
  const { segments } = await params;
  const { categorySlug } = parseSegments(segments);
  const category = categorySlug ? await getPostCategoryBySlug(categorySlug) : null;
  return { title: category ? category.PostCategoryTitle : "Updates & Posts" };
}

export default async function PostsPage({ params }: Props) {
  const { segments } = await params;
  const { categorySlug, page } = parseSegments(segments);

  const [settings, allCategories] = await Promise.all([
    getGlobalSettings(),
    getAllPostCategoriesFlat(),
  ]);

  const category = categorySlug ? await getPostCategoryBySlug(categorySlug) : null;
  if (categorySlug && !category) notFound();

  const catId = category?.PostCategoryID ?? 0;
  const [total, posts, ancestors] = await Promise.all([
    getPostsCount(catId),
    getPosts(catId, PER_PAGE, (page - 1) * PER_PAGE),
    category ? getPostCategoryAncestors(catId) : Promise.resolve([]),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  if (page > totalPages && total > 0) notFound();

  const basePath = categorySlug ? `/posts/${categorySlug}` : "/posts";
  const pageTitle = category?.PostCategoryTitle ?? "Updates & Posts";

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    ...ancestors.map((a) => ({
      label: a.PostCategoryTitle,
      href: `/posts/${a.PostCategoryTitleAlias}`,
    })),
    ...(category ? [{ label: category.PostCategoryTitle }] : []),
  ];

  const bannerSrc = category?.PostCategoryHeaderImage
    ? resolveMediaUrl("posts/category", category.PostCategoryHeaderImage)
    : resolveMediaUrl("defaults/posts", settings?.ConfigPostsImage ?? null);

  const categoryOptions = allCategories.map((c) => ({
    slug: c.PostCategoryTitleAlias,
    title: c.PostCategoryTitle,
    depth: c.depth ?? 0,
  }));

  const subtitle = categorySlug === "presscoverages"
    ? "Press features, news coverage and media mentions about Saraswata Niketanam"
    : "Browse articles, updates and announcements from our library";

  const postItems = posts.map((post) => ({
    id: post.PostID,
    title: post.PostTitle,
    href: `/${post.PostTitleAlias}`,
    imageUrl: resolveMediaUrl("posts", post.PostImage),
    excerpt: post.PostDescription?.replace(/<[^>]+>/g, "").slice(0, 140),
    date: post.PostPublishedDate,
  }));

  return (
    <PageShell
      title={pageTitle}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      bannerSrc={bannerSrc}
      bannerAlt="Posts"
    >
      <CategorySelect
        categories={categoryOptions}
        currentSlug={categorySlug}
        basePath="/posts"
      />

      <PostCardGrid items={postItems} featuredLayout={page === 1} />

      <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
    </PageShell>
  );
}
