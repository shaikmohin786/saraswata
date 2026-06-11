import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePostCategory } from "@/actions/admin";
import { getAdminPostCategories, getAdminPostCategory } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostCategoryPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const cat = await getAdminPostCategory(Number(id));
  if (!cat) notFound();
  const parents = (await getAdminPostCategories())
    .filter((c) => c.PostCategoryID !== Number(id))
    .map((c) => ({ id: c.PostCategoryID as number, title: c.PostCategoryTitle as string }));
  const data = cat as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Post Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={savePostCategory}
          cancelHref="/admin/posts/categories"
          hiddenFields={{ id: Number(id) }}
          fields={categoryFields(data, parents, "PostCategory", "posts")}
        />
      </div>
    </>
  );
}
