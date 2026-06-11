import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveVideoCategory } from "@/actions/admin";
import { getAdminVideoCategories, getAdminVideoCategory } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditVideoCategoryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const cat = await getAdminVideoCategory(Number(id));
  if (!cat) notFound();
  const parents = (await getAdminVideoCategories())
    .filter((c) => c.VideoCategoryID !== Number(id))
    .map((c) => ({ id: c.VideoCategoryID as number, title: c.VideoCategoryTitle as string }));
  const data = cat as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Video Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveVideoCategory}
          cancelHref="/admin/videos/categories"
          hiddenFields={{ id: Number(id) }}
          fields={categoryFields(data, parents, "VideoCategory", "videos")}
        />
      </div>
    </>
  );
}
