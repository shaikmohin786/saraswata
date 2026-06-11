import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { savePage } from "@/actions/admin";
import { getAdminPage } from "@/lib/db/queries/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const page = await getAdminPage(Number(id));
  if (!page) notFound();
  const p = page as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Page" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={savePage}
          cancelHref="/admin/pages"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "title", label: "Title", defaultValue: p.PageTitle as string },
            { name: "alias", label: "URL Slug", defaultValue: p.PageTitleAlias as string },
            { name: "description", label: "Content", type: "textarea", rows: 12, defaultValue: p.PageDescription as string },
            { name: "image", label: "Page Image", type: "image", uploadCategory: "pages", defaultValue: p.PageImage as string },
            statusField(p.PageStatus as number),
            ...seoFields(p, "Page"),
          ]}
        />
      </div>
    </>
  );
}
