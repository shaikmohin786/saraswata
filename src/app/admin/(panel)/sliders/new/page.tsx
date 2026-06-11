import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveSlider } from "@/actions/admin";

const slideFields = [1, 2, 3, 4, 5].flatMap((n) => [
  { name: `image${n}`, label: `Slide ${n} Image`, type: "image" as const, uploadCategory: "sliders" },
  { name: `text${n}`, label: `Slide ${n} Text`, type: "textarea" as const, rows: 3 },
]);

export default async function NewSliderPage() {
  const session = await auth();

  return (
    <>
      <AdminHeader title="Add Slider" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm action={saveSlider} cancelHref="/admin/sliders" fields={slideFields} />
      </div>
    </>
  );
}
