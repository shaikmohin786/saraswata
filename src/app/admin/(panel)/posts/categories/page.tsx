import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import { getAdminPostCategories } from "@/lib/db/queries/categories-admin";
import { deletePostCategory } from "@/actions/admin";

export default async function PostCategoriesPage() {
  const session = await auth();
  const categories = await getAdminPostCategories();

  return (
    <>
      <AdminHeader title="Post Categories" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="mb-4 flex justify-between">
          <Link href="/admin/posts"><Button variant="outline">← Back to Posts</Button></Link>
          <Link href="/admin/posts/categories/new"><Button>Add Category</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Slug</th>
                <th >Order</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.PostCategoryID as number} >
                  <td >{c.PostCategoryTitle as string}</td>
                  <td >{c.PostCategoryTitleAlias as string}</td>
                  <td >{c.PostCategoryOrdering as number}</td>
                  <td ><StatusBadge status={c.PostCategoryStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/posts/categories/${c.PostCategoryID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deletePostCategory.bind(null, c.PostCategoryID as number)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
