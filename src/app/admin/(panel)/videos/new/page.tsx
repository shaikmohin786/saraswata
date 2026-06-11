import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveVideo } from "@/actions/admin";
import { getVideoCategories } from "@/lib/db/queries/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

export default async function NewVideoPage() {
  const session = await auth();
  const categories = await getVideoCategories();

  return (
    <>
      <AdminHeader title="Add Video" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveVideo}
          cancelHref="/admin/videos"
          fields={[
            { name: "title", label: "Title" },
            { name: "alias", label: "URL Slug" },
            { name: "description", label: "Description", type: "textarea", rows: 8 },
            { name: "youtubeUrl", label: "YouTube URL" },
            {
              name: "categoryId", label: "Category", type: "select", defaultValue: 0,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.VideoCategoryID as number, label: c.VideoCategoryTitle as string }))],
            },
            { name: "tags", label: "Tags" },
            statusField(0),
            ...seoFields({}, "Video"),
          ]}
        />
      </div>
    </>
  );
}
