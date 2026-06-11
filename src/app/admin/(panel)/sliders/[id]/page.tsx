import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveSlider } from "@/actions/admin";
import { getAdminSlider } from "@/lib/db/queries/admin";

type Props = { params: Promise<{ id: string }> };

export default async function EditSliderPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const slider = await getAdminSlider(Number(id));
  if (!slider) notFound();
  const s = slider as Record<string, unknown>;

  const slideFields = [1, 2, 3, 4, 5].flatMap((n) => [
    { name: `image${n}`, label: `Slide ${n} Image`, type: "image" as const, uploadCategory: "sliders", defaultValue: s[`SliderImage${n}`] as string },
    { name: `text${n}`, label: `Slide ${n} Text`, type: "textarea" as const, rows: 3, defaultValue: s[`SliderText${n}`] as string },
  ]);

  return (
    <>
      <AdminHeader title="Edit Slider" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveSlider}
          cancelHref="/admin/sliders"
          hiddenFields={{ id: Number(id) }}
          fields={slideFields}
        />
      </div>
    </>
  );
}
