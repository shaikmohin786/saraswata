import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { getAdminSliders } from "@/lib/db/queries/admin";

export default async function AdminSlidersPage() {
  const session = await auth();
  const sliders = await getAdminSliders();

  return (
    <>
      <AdminHeader title="Sliders" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/sliders/new"><Button>Add Slider</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >ID</th>
                <th >Slide 1 Image</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((s) => (
                <tr key={s.SliderID as number} >
                  <td >{s.SliderID as number}</td>
                  <td >{(s.SliderImage1 as string) || "—"}</td>
                  <td >
                    <Link href={`/admin/sliders/${s.SliderID}`}><Button variant="outline" size="sm">Edit</Button></Link>
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
