import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveGallery } from "@/actions/admin";
import { getAdminGallery, getGalleryCategories } from "@/lib/db/queries/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditGalleryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const gallery = await getAdminGallery(Number(id));
  if (!gallery) notFound();
  const categories = await getGalleryCategories();
  const g = gallery as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Gallery" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveGallery}
          cancelHref="/admin/gallery"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "title", label: "Title", defaultValue: g.GalleryTitle as string },
            { name: "alias", label: "URL Slug", defaultValue: g.GalleryTitleAlias as string },
            { name: "description", label: "Description", type: "textarea", rows: 8, defaultValue: g.GalleryDescription as string },
            { name: "image", label: "Image", type: "image", uploadCategory: "gallery", defaultValue: g.GalleryImage as string },
            {
              name: "categoryId", label: "Category", type: "select", defaultValue: g.GalleryCategory as number,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.GalleryCategoryID as number, label: c.GalleryCategoryTitle as string }))],
            },
            { name: "tags", label: "Tags", defaultValue: g.GalleryTags as string },
            statusField(g.GalleryStatus as number),
            ...seoFields(g, "Gallery"),
          ]}
        />
      </div>
    </>
  );
}
