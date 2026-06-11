import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveMenuItem } from "@/actions/admin";
import { getAdminMenuItems } from "@/lib/db/queries/admin";

export default async function NewMenuItemPage() {
  const session = await auth();
  const menuItems = await getAdminMenuItems();

  return (
    <>
      <AdminHeader title="Add Menu Item" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveMenuItem}
          cancelHref="/admin/menu"
          fields={[
            { name: "title", label: "Title" },
            {
              name: "parentId",
              label: "Parent",
              type: "select",
              defaultValue: 0,
              options: [
                { value: 0, label: "None (top level)" },
                ...menuItems.map((mi) => ({
                  value: mi.MenuID as number,
                  label: mi.MenuTitle as string,
                })),
              ],
            },
            {
              name: "menuType",
              label: "Menu Type",
              type: "select",
              defaultValue: "Internal",
              options: [
                { value: "Internal", label: "Internal" },
                { value: "Homepage", label: "Homepage" },
                { value: "External", label: "External" },
              ],
            },
            { name: "parameter", label: "Parameter" },
            { name: "slug", label: "Slug" },
            {
              name: "status",
              label: "Status",
              type: "select",
              defaultValue: 0,
              options: [
                { value: 0, label: "Active" },
                { value: 1, label: "Inactive" },
              ],
            },
            { name: "ordering", label: "Ordering", type: "number", defaultValue: 0 },
          ]}
        />
      </div>
    </>
  );
}
