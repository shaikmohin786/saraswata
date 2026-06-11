import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveGallery } from "@/actions/admin";
import { getGalleryCategories } from "@/lib/db/queries/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

export default async function NewGalleryPage() {
  const session = await auth();
  const categories = await getGalleryCategories();

  return (
    <>
      <AdminHeader title="Add Gallery" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveGallery}
          cancelHref="/admin/gallery"
          fields={[
            { name: "title", label: "Title" },
            { name: "alias", label: "URL Slug" },
            { name: "description", label: "Description", type: "textarea", rows: 8 },
            { name: "image", label: "Image", type: "image", uploadCategory: "gallery" },
            {
              name: "categoryId", label: "Category", type: "select", defaultValue: 0,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.GalleryCategoryID as number, label: c.GalleryCategoryTitle as string }))],
            },
            { name: "tags", label: "Tags" },
            statusField(0),
            ...seoFields({}, "Gallery"),
          ]}
        />
      </div>
    </>
  );
}
