import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { getAdminGalleries } from "@/lib/db/queries/admin";
import { deleteGallery } from "@/actions/admin";

export default async function AdminGalleryPage() {
  const session = await auth();
  const galleries = await getAdminGalleries();

  return (
    <>
      <AdminHeader title="Gallery" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/gallery/categories"><Button variant="outline">Categories</Button></Link>
          <Link href="/admin/gallery/new"><Button>Add Gallery</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Category</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((g) => (
                <tr key={g.GalleryID as number} >
                  <td >{g.GalleryTitle as string}</td>
                  <td >{(g.GalleryCategoryTitle as string) || "—"}</td>
                  <td ><StatusBadge status={g.GalleryStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/gallery/${g.GalleryID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteGallery.bind(null, g.GalleryID as number)} />
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
