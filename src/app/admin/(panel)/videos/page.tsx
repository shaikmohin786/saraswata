import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { getAdminVideos } from "@/lib/db/queries/admin";
import { deleteVideo } from "@/actions/admin";

export default async function AdminVideosPage() {
  const session = await auth();
  const videos = await getAdminVideos();

  return (
    <>
      <AdminHeader title="Videos" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/videos/categories"><Button variant="outline">Categories</Button></Link>
          <Link href="/admin/videos/new"><Button>Add Video</Button></Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th >Title</th>
                <th >Category</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.VideoID as number} >
                  <td >{v.VideoTitle as string}</td>
                  <td >{(v.VideoCategoryTitle as string) || "—"}</td>
                  <td ><StatusBadge status={v.VideoStatus as number} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/videos/${v.VideoID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deleteVideo.bind(null, v.VideoID as number)} />
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
