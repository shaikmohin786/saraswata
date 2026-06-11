import { getGlobalSettings } from "@/lib/db/queries/settings";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { siteConfig } from "@/config/site";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const settings = await getGlobalSettings();
  const logoUrl = resolveMediaUrl("brand", settings?.ConfigSiteLogo);
  const siteName = (settings?.ConfigSiteName as string) || siteConfig.name;

  return <AdminLoginForm logoUrl={logoUrl} siteName={siteName} />;
}
