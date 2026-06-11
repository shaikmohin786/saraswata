import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePost } from "@/actions/admin";
import { getAllPostCategoriesFlat } from "@/lib/db/queries/posts";
import { seoFields, statusField } from "@/lib/admin/form-fields";

export default async function NewPostPage() {
  const session = await auth();
  const categories = await getAllPostCategoriesFlat();

  return (
    <>
      <AdminHeader title="Add Post" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={savePost}
          cancelHref="/admin/posts"
          fields={[
            { name: "title", label: "Title" },
            { name: "alias", label: "URL Slug" },
            { name: "description", label: "Content", type: "textarea", rows: 12 },
            { name: "image", label: "Featured Image", type: "image", uploadCategory: "posts" },
            {
              name: "categoryId", label: "Category", type: "select", defaultValue: 0,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.PostCategoryID, label: c.PostCategoryTitle }))],
            },
            { name: "tags", label: "Tags" },
            { name: "videoUrl", label: "YouTube URL" },
            { name: "videoCode", label: "YouTube Embed Code", type: "textarea", rows: 3 },
            { name: "publishedDate", label: "Published Date", type: "date" },
            statusField(0),
            ...seoFields({}, "Post"),
          ]}
        />
      </div>
    </>
  );
}
