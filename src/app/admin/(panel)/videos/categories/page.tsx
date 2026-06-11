import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import { getAdminVideoCategories } from "@/lib/db/queries/categories-admin";
import { deleteVideoCategory } from "@/actions/admin";

export default async function VideoCategoriesPage() {
  const session = await auth();
  const categories = await getAdminVideoCategories();

  return (
    <>
      <AdminHeader title="Video Categories" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="mb-4 flex justify-between">
          <Link href="/admin/videos"><Button variant="outline">← Back to Videos</Button></Link>
          <Link href="/admin/videos/categories/new"><Button>Add Category</Button></Link>
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
                <tr key={c.VideoCategoryID as number} >
                  <td >{c.VideoCategoryTitle as string}</td>
                  <td >{c.VideoCategoryTitleAlias as string}</td>
                  <td >{c.VideoCategoryOrdering as number}</td>
                  <td ><StatusBadge status={c.VideoCategoryStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/videos/categories/${c.VideoCategoryID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteVideoCategory.bind(null, c.VideoCategoryID as number)} />
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
