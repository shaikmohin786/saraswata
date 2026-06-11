import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { getAllUsers } from "@/lib/db/queries/users";
import { deleteUser } from "@/actions/admin";

const roleLabels: Record<number, string> = {
  0: "Admin",
  1: "Editor",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await getAllUsers();

  return (
    <>
      <AdminHeader title="Users" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/users/new"><Button>Add User</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Name</th>
                <th >Email</th>
                <th >Role</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.UserID} >
                  <td >{u.UserFirstName} {u.UserLastName}</td>
                  <td >{u.UserEmailID}</td>
                  <td >{roleLabels[u.UserRole] ?? u.UserRole}</td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/users/${u.UserID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteUser.bind(null, u.UserID)} />
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
