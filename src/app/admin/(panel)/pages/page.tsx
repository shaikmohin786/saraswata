import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { getAdminPages } from "@/lib/db/queries/admin";
import { deletePage } from "@/actions/admin";

export default async function AdminPagesPage() {
  const session = await auth();
  const pages = await getAdminPages();

  return (
    <>
      <AdminHeader title="Pages" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/pages/new"><Button>Add Page</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Slug</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.PageID as number} >
                  <td >{p.PageTitle as string}</td>
                  <td >{p.PageTitleAlias as string}</td>
                  <td ><StatusBadge status={p.PageStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/pages/${p.PageID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deletePage.bind(null, p.PageID as number)} />
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
