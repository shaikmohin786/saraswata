import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveVideo } from "@/actions/admin";
import { getAdminVideo, getVideoCategories } from "@/lib/db/queries/admin";
import { seoFields, statusField } from "@/lib/admin/form-fields";

type Props = { params: Promise<{ id: string }> };

export default async function EditVideoPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const video = await getAdminVideo(Number(id));
  if (!video) notFound();
  const categories = await getVideoCategories();
  const v = video as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Edit Video" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveVideo}
          cancelHref="/admin/videos"
          hiddenFields={{ id: Number(id) }}
          fields={[
            { name: "title", label: "Title", defaultValue: v.VideoTitle as string },
            { name: "alias", label: "URL Slug", defaultValue: v.VideoTitleAlias as string },
            { name: "description", label: "Description", type: "textarea", rows: 8, defaultValue: v.VideoDescription as string },
            { name: "youtubeUrl", label: "YouTube URL", defaultValue: v.VideoYoutubeURL as string },
            {
              name: "categoryId", label: "Category", type: "select", defaultValue: v.VideoCategory as number,
              options: [{ value: 0, label: "None" }, ...categories.map((c) => ({ value: c.VideoCategoryID as number, label: c.VideoCategoryTitle as string }))],
            },
            { name: "tags", label: "Tags", defaultValue: v.VideoTags as string },
            statusField(v.VideoStatus as number),
            ...seoFields(v, "Video"),
          ]}
        />
      </div>
    </>
  );
}
