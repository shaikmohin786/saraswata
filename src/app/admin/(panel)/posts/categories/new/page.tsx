import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePostCategory } from "@/actions/admin";
import { getAdminPostCategories } from "@/lib/db/queries/categories-admin";
import { categoryFields } from "@/lib/admin/form-fields";

export default async function NewPostCategoryPage() {
  const session = await auth();
  const parents = (await getAdminPostCategories()).map((c) => ({
    id: c.PostCategoryID as number,
    title: c.PostCategoryTitle as string,
  }));

  return (
    <>
      <AdminHeader title="Add Post Category" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm action={savePostCategory} cancelHref="/admin/posts/categories" fields={categoryFields({}, parents, "PostCategory", "posts")} />
      </div>
    </>
  );
}
