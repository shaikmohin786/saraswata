import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getTrashItems } from "@/lib/db/queries/admin";
import { restoreTrash, permanentDelete } from "@/actions/admin";

export default async function AdminTrashPage() {
  const session = await auth();
  const items = await getTrashItems();

  return (
    <>
      <AdminHeader title="Trash" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Type</th>
                <th >Deleted</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">Trash is empty.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={`${item.type}-${item.id}`} >
                    <td >{item.title as string}</td>
                    <td className="px-4 py-3 capitalize">{item.type as string}</td>
                    <td >{item.deleted ? String(item.deleted) : "—"}</td>
                    <td >
                      <div className="flex gap-2">
                        <DeleteButton
                          action={restoreTrash.bind(null, item.type as string, item.id as number)}
                          label="Restore"
                        />
                        <DeleteButton
                          action={permanentDelete.bind(null, item.type as string, item.id as number)}
                          label="Delete Forever"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
