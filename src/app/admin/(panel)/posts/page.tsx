import Link from "next/link";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/AdminTable";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button } from "@/components/ui/button";
import { getAdminPosts } from "@/lib/db/queries/admin";
import { deletePost } from "@/actions/admin";

export default async function AdminPostsPage() {
  const session = await auth();
  const posts = await getAdminPosts();

  return (
    <>
      <AdminHeader title="Posts" userName={session?.user?.name} />
      <div className="admin-page-body">
        <div className="admin-toolbar admin-toolbar-actions justify-end">
          <Link href="/admin/posts/categories"><Button variant="outline">Categories</Button></Link>
          <Link href="/admin/posts/new"><Button>Add Post</Button></Link>
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
              {posts.map((p) => (
                <tr key={p.PostID} >
                  <td >{p.PostTitle}</td>
                  <td >{(p.PostCategoryTitle as string) || "—"}</td>
                  <td ><StatusBadge status={p.PostStatus} /></td>
                  <td >
                    <div className="flex gap-2">
                      <Link href={`/admin/posts/${p.PostID}`}><Button variant="outline" size="sm">Edit</Button></Link>
                      <DeleteButton action={deletePost.bind(null, p.PostID)} />
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
