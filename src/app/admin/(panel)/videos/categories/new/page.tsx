import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveVideoCategory } from "@/actions/admin";
import { getAdminVideoCategories } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

export default async function NewVideoCategoryPage() {
  const session = await auth();
  const parents = (await getAdminVideoCategories()).map((c) => ({
    id: c.VideoCategoryID as number,
    title: c.VideoCategoryTitle as string,
  }));

  return (
    <>
      <AdminHeader title="Add Video Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm action={saveVideoCategory} cancelHref="/admin/videos/categories" fields={categoryFields({}, parents, "VideoCategory", "videos")} />
      </div>
    </>
  );
}
