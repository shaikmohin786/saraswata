import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusBadge } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import { getAdminGalleryCategories } from "@/lib/db/queries/categories-admin";
import { deleteGalleryCategory } from "@/actions/admin";

export default async function GalleryCategoriesPage() {
  const session = await auth();
  const categories = await getAdminGalleryCategories();

  return (
    <>
      <AdminHeader title="Gallery Categories" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="mb-4 flex justify-between">
          <Link href="/admin/gallery"><Button variant="outline">← Back to Gallery</Button></Link>
          <Link href="/admin/gallery/categories/new"><Button>Add Category</Button></Link>
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
                <tr key={c.GalleryCategoryID as number} >
                  <td >{c.GalleryCategoryTitle as string}</td>
                  <td >{c.GalleryCategoryTitleAlias as string}</td>
                  <td >{c.GalleryCategoryOrdering as number}</td>
                  <td ><StatusBadge status={c.GalleryCategoryStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/gallery/categories/${c.GalleryCategoryID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteGalleryCategory.bind(null, c.GalleryCategoryID as number)} />
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
