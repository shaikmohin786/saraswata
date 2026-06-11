import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getDashboardStats } from "@/lib/db/queries/admin";
import { FileText, Files, Image, Video, Users, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getDashboardStats();
  const firstName = session?.user?.name?.split(" ")[0];

  const cards = [
    { label: "Posts", count: stats.posts, href: "/admin/posts", icon: FileText, hint: "News & press coverage" },
    { label: "Pages", count: stats.pages, href: "/admin/pages", icon: Files, hint: "Static site pages" },
    { label: "Gallery", count: stats.gallery, href: "/admin/gallery", icon: Image, hint: "Photo archives" },
    { label: "Videos", count: stats.videos, href: "/admin/videos", icon: Video, hint: "Video library" },
    { label: "Users", count: stats.users, href: "/admin/users", icon: Users, hint: "Admin accounts" },
    { label: "Trash", count: stats.trash, href: "/admin/trash", icon: Trash2, hint: "Deleted items" },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        userName={session?.user?.name}
        description={
          firstName
            ? `Welcome back, ${firstName}. Manage your site content from here.`
            : "Manage your site content from here."
        }
      />
      <div className="admin-page-body">
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
          <p className="text-sm font-medium text-primary">Quick start</p>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Use the sidebar to edit posts, pages, gallery, videos, menu, and site settings. Changes appear on the public website after you save.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ label, count, href, icon: Icon, hint }) => (
            <Link key={label} href={href} className="admin-stat-card group">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted">{label}</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-primary">{count}</p>
                  <p className="mt-2 text-xs text-muted">{hint}</p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary/70 transition-colors group-hover:text-accent">
                Open module
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
