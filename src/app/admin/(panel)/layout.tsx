import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SessionProvider } from "next-auth/react";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { siteConfig } from "@/config/site";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const settings = await getGlobalSettings();
  const logoUrl = resolveMediaUrl("brand", settings?.ConfigSiteLogo);
  const siteName = (settings?.ConfigSiteName as string) || siteConfig.name;

  return (
    <SessionProvider session={session}>
      <div className="admin-shell flex min-h-screen bg-[#f6f3ec]">
        <AdminSidebar logoUrl={logoUrl} siteName={siteName} />
        <main className="admin-main flex min-w-0 flex-1 flex-col pt-16 lg:pt-0">{children}</main>
      </div>
    </SessionProvider>
  );
}
