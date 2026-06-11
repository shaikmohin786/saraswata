import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveUser } from "@/actions/admin";

export default async function NewUserPage() {
  const session = await auth();

  return (
    <>
      <AdminHeader title="Add User" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveUser}
          cancelHref="/admin/users"
          fields={[
            { name: "firstName", label: "First Name" },
            { name: "lastName", label: "Last Name" },
            { name: "email", label: "Email" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "role", label: "Role", type: "select", defaultValue: 1,
              options: [{ value: 1, label: "Admin" }, { value: 2, label: "Editor" }],
            },
            {
              name: "status", label: "Status", type: "select", defaultValue: 0,
              options: [{ value: 0, label: "Active" }, { value: 1, label: "Inactive" }],
            },
          ]}
        />
      </div>
    </>
  );
}
