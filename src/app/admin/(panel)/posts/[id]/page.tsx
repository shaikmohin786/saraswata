import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePost } from "@/actions/admin";
import { getAdminPost } from "@/lib/db/queries/admin";
import { getAllPostCategoriesFlat } from "@/lib/db/queries/posts";
import { seoFields, statusField } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const post = await getAdminPost(Number(id));
  if (!post) notFound();
  const categories = await getAllPostCategoriesFlat();
  const p = post as Record<string, unknown>;
  const pubDate = p.PostPublishedDate ? String(p.PostPublishedDate).slice(0, 10) : "";

  return (
    <>
      <AdminHeader title="Edit Post" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={savePost}
          cancelHref="/admin/posts"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "title", label: "Title", defaultValue: p.PostTitle as string },
            { name: "alias", label: "URL Slug", defaultValue: p.PostTitleAlias as string },
            { name: "description", label: "Content", type: "textarea", rows: 12, defaultValue: p.PostDescription as string },
            { name: "image", label: "Featured Image", type: "image", uploadCategory: "posts", defaultValue: p.PostImage as string },
            {
              name: "categoryId", label: "Category", type: "select",
              defaultValue: p.PostCategoryID as number,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.PostCategoryID, label: c.PostCategoryTitle }))],
            },
            { name: "tags", label: "Tags", defaultValue: p.PostTags as string },
            { name: "videoUrl", label: "YouTube URL", defaultValue: p.PostVideoURL as string },
            { name: "videoCode", label: "YouTube Embed Code", type: "textarea", rows: 3, defaultValue: p.PostVideoCode as string },
            { name: "publishedDate", label: "Published Date", type: "date", defaultValue: pubDate },
            statusField(p.PostStatus as number),
            ...seoFields(p, "Post"),
          ]}
        />
      </div>
    </>
  );
}
