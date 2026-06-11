import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveGalleryCategory } from "@/actions/admin";
import { getAdminGalleryCategories } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

export default async function NewGalleryCategoryPage() {
  const session = await auth();
  const parents = (await getAdminGalleryCategories()).map((c) => ({
    id: c.GalleryCategoryID as number,
    title: c.GalleryCategoryTitle as string,
  }));

  return (
    <>
      <AdminHeader title="Add Gallery Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm action={saveGalleryCategory} cancelHref="/admin/gallery/categories" fields={categoryFields({}, parents, "GalleryCategory", "gallery")} />
      </div>
    </>
  );
}
