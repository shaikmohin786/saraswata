import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveMenuItem } from "@/actions/admin";
import { getAdminMenuItem, getAdminMenuItems } from "@/lib/db/queries/admin";

type Props = { params: Promise<{ id: string }> };

export default async function EditMenuItemPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const item = await getAdminMenuItem(Number(id));
  if (!item) notFound();
  const menuItems = await getAdminMenuItems();
  const m = item as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Menu Item" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveMenuItem}
          cancelHref="/admin/menu"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "title", label: "Title", defaultValue: m.MenuTitle as string },
            {
              name: "parentId", label: "Parent", type: "select", defaultValue: m.MenuParentID as number,
              options: [{ value: 0, label: "None (top level)" }, ...menuItems.filter((mi) => mi.MenuID !== Number(id)).map((mi) => ({ value: mi.MenuID as number, label: mi.MenuTitle as string }))],
            },
            {
              name: "menuType", label: "Menu Type", type: "select", defaultValue: m.MenuType as string,
              options: [
                { value: "Internal", label: "Internal" },
                { value: "Homepage", label: "Homepage" },
                { value: "External", label: "External" },
              ],
            },
            { name: "parameter", label: "Parameter", defaultValue: m.MenuParameter as string },
            { name: "slug", label: "Slug", defaultValue: m.MenuSlug as string },
            {
              name: "status", label: "Status", type: "select", defaultValue: m.MenuStatus as number,
              options: [{ value: 0, label: "Active" }, { value: 1, label: "Inactive" }],
            },
            { name: "ordering", label: "Ordering", type: "number", defaultValue: m.MenuOrdering as number },
          ]}
        />
      </div>
    </>
  );
}
