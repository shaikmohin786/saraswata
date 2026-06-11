import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { MenuReorderButtons } from "@/components/admin/MenuReorderButtons";
import { Button } from "@/components/ui/button";
import { getAdminMenuItems } from "@/lib/db/queries/admin";
import { deleteMenuItem } from "@/actions/admin";

export default async function AdminMenuPage() {
  const session = await auth();
  const items = await getAdminMenuItems();

  return (
    <>
      <AdminHeader title="Menu" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/menu/new"><Button>Add Menu Item</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Type</th>
                <th >Slug</th>
                <th >Order</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.MenuID as number} >
                  <td >{m.MenuTitle as string}</td>
                  <td >{m.MenuType as string}</td>
                  <td >{m.MenuSlug as string}</td>
                  <td >
                    <div className="flex items-center gap-2">
                      <span>{m.MenuOrdering as number}</span>
                      <MenuReorderButtons id={m.MenuID as number} />
                    </div>
                  </td>
                  <td ><StatusBadge status={m.MenuStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/menu/${m.MenuID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteMenuItem.bind(null, m.MenuID as number)} />
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
