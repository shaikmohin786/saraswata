import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePage } from "@/actions/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

export default async function NewPagePage() {
  const session = await auth();

  return (
    <>
      <AdminHeader title="Add Page" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={savePage}
          cancelHref="/admin/pages"
          fields={[
            { name: "title", label: "Title" },
            { name: "alias", label: "URL Slug" },
            { name: "description", label: "Content", type: "textarea", rows: 12 },
            { name: "image", label: "Page Image", type: "image", uploadCategory: "pages" },
            statusField(0),
            ...seoFields({}, "Page"),
          ]}
        />
      </div>
    </>
  );
}
