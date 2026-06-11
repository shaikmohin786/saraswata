import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveProfile } from "@/actions/admin";
import { getUserById } from "@/lib/db/queries/users";

export default async function AdminProfilePage() {
  const session = await auth();
  const userId = Number(session?.user?.id);
  const user = userId ? await getUserById(userId) : null;

  return (
    <>
      <AdminHeader title="My Profile" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveProfile}
          cancelHref="/admin/profile"
          submitLabel="Update Profile"
          fields={[
            { name: "firstName", label: "First Name", defaultValue: user?.UserFirstName ?? "" },
            { name: "lastName", label: "Last Name", defaultValue: user?.UserLastName ?? "" },
            { name: "phone", label: "Phone", defaultValue: user?.UserPhone ?? "" },
            { name: "password", label: "New Password (leave blank to keep current)", type: "password" },
          ]}
        />
      </div>
    </>
  );
}
