import { SiteHeader } from "@/components/public/layout/SiteHeader";
import { HomeScrollRestore } from "@/components/public/layout/HomeScrollRestore";
import { PublicMain } from "@/components/public/layout/PublicMain";
import { SiteFooter } from "@/components/public/layout/SiteFooter";
import { WelcomeEntryBanner } from "@/components/public/WelcomeEntryBanner";
import { AnalyticsScript } from "@/components/public/AnalyticsScript";
import { getPublicLayoutData } from "@/lib/db/get-public-layout-data";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import { siteConfig } from "@/config/site";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  let menu: Awaited<ReturnType<typeof getPublicLayoutData>>["menu"] = [];

  try {
    const data = await getPublicLayoutData();
    settings = data.settings;
    menu = data.menu;
  } catch {
    // Database not ready — layout still renders with fallbacks
  }

  const siteName = settings?.ConfigSiteName?.trim() || siteConfig.name;
  const logoUrl = resolveMediaUrl("brand", settings?.ConfigSiteLogo);

  return (
    <>
      <AnalyticsScript code={settings?.ConfigAnalyticsCode} />
      <WelcomeEntryBanner
        siteName={siteName}
        logoUrl={logoUrl}
        workingHoursHtml={settings?.ConfigWorkingHours || ""}
      />
      <SiteHeader siteName={siteName} logoUrl={logoUrl} menu={menu} />
      <HomeScrollRestore />
      <PublicMain>{children}</PublicMain>
      <SiteFooter
        siteName={siteName}
        footerText={settings?.ConfigFooterText || `© ${new Date().getFullYear()} ${siteName}. All Rights Reserved.`}
        contactHtml={settings?.ConfigContact || ""}
        workingHoursHtml={settings?.ConfigWorkingHours || ""}
        social={{
          facebook: settings?.ConfigFBURL,
          twitter: settings?.ConfigTwitterURL,
          linkedin: settings?.ConfigLinkedinURL,
          instagram: settings?.ConfigInstagramURL,
          youtube: settings?.ConfigYoutubeURL,
          pinterest: settings?.ConfigPinterestURL,
        }}
      />
    </>
  );
}
