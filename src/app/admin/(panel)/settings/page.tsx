import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CrudForm } from "@/components/admin/CrudForm";
import { saveSettings } from "@/actions/admin";
import { getGlobalSettings } from "@/lib/db/queries/settings";

export default async function AdminSettingsPage() {
  const session = await auth();
  const settings = await getGlobalSettings();
  const s = (settings ?? {}) as Record<string, unknown>;

  return (
    <>
      <AdminHeader title="Settings" userName={session?.user?.name} />
      <div className="admin-page-body">
        <CrudForm
          action={saveSettings}
          cancelHref="/admin/settings"
          fields={[
            { name: "siteName", label: "Site Name", defaultValue: s.ConfigSiteName as string },
            { name: "content", label: "Homepage Content", type: "textarea", rows: 10, defaultValue: s.ConfigContent as string },
            { name: "footerText", label: "Footer Text", type: "textarea", rows: 4, defaultValue: s.ConfigFooterText as string },
            { name: "contact", label: "Contact", type: "textarea", rows: 6, defaultValue: s.ConfigContact as string },
            { name: "workingHours", label: "Working Hours", type: "textarea", rows: 4, defaultValue: s.ConfigWorkingHours as string },
            { name: "maps", label: "Maps Embed", type: "textarea", rows: 4, defaultValue: s.ConfigMaps as string },
            { name: "logo", label: "Site Logo", type: "image", uploadCategory: "brand", defaultValue: s.ConfigSiteLogo as string },
            { name: "defaultTitle", label: "Default SEO Title", defaultValue: s.ConfigDefaultTitle as string },
            { name: "defaultDescription", label: "Default SEO Description", type: "textarea", rows: 3, defaultValue: s.ConfigDefaultDescription as string },
            { name: "defaultKeywords", label: "Default SEO Keywords", defaultValue: s.ConfigDefaultKeywords as string },
            { name: "analyticsCode", label: "Google Analytics Code", type: "textarea", rows: 5, defaultValue: s.ConfigAnalyticsCode as string },
            { name: "fbUrl", label: "Facebook URL", defaultValue: s.ConfigFBURL as string },
            { name: "twitterUrl", label: "Twitter URL", defaultValue: s.ConfigTwitterURL as string },
            { name: "linkedinUrl", label: "LinkedIn URL", defaultValue: s.ConfigLinkedinURL as string },
            { name: "instagramUrl", label: "Instagram URL", defaultValue: s.ConfigInstagramURL as string },
            { name: "youtubeUrl", label: "YouTube URL", defaultValue: s.ConfigYoutubeURL as string },
            { name: "pinterestUrl", label: "Pinterest URL", defaultValue: s.ConfigPinterestURL as string },
            { name: "postsBanner", label: "Posts Section Banner", type: "image", uploadCategory: "defaults/posts", defaultValue: s.ConfigPostsImage as string },
            { name: "galleryBanner", label: "Gallery Section Banner", type: "image", uploadCategory: "defaults/gallery", defaultValue: s.ConfigGalleryImage as string },
            { name: "videosBanner", label: "Videos Section Banner", type: "image", uploadCategory: "defaults/videos", defaultValue: s.ConfigVideosImage as string },
          ]}
        />
      </div>
    </>
  );
}
