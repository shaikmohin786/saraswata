import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveGalleryCategory } from "@/actions/admin";
import { getAdminGalleryCategories, getAdminGalleryCategory } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditGalleryCategoryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const cat = await getAdminGalleryCategory(Number(id));
  if (!cat) notFound();
  const parents = (await getAdminGalleryCategories())
    .filter((c) => c.GalleryCategoryID !== Number(id))
    .map((c) => ({ id: c.GalleryCategoryID as number, title: c.GalleryCategoryTitle as string }));
  const data = cat as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Gallery Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveGalleryCategory}
          cancelHref="/admin/gallery/categories"
          hiddenFields={{ id: Number(id) }}
          fields={categoryFields(data, parents, "GalleryCategory", "gallery")}
        />
      </div>
    </>
  );
}
