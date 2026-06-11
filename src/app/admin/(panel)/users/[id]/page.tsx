import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveUser } from "@/actions/admin";
import { getUserById } from "@/lib/db/queries/users";

type Props = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const user = await getUserById(Number(id));
  if (!user) notFound();

  return (
    <>
      <AdminHeader title="Edit User" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveUser}
          cancelHref="/admin/users"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "firstName", label: "First Name", defaultValue: user.UserFirstName },
            { name: "lastName", label: "Last Name", defaultValue: user.UserLastName },
            { name: "email", label: "Email", defaultValue: user.UserEmailID },
            { name: "password", label: "Password (leave blank to keep current)", type: "password" },
            {
              name: "role", label: "Role", type: "select", defaultValue: user.UserRole,
              options: [{ value: 1, label: "Admin" }, { value: 2, label: "Editor" }],
            },
            {
              name: "status", label: "Status", type: "select", defaultValue: user.UserStatus,
              options: [{ value: 0, label: "Active" }, { value: 1, label: "Inactive" }],
            },
          ]}
        />
      </div>
    </>
  );
}
