import { notFound } from "next/navigation";
import { CmsPageLayout } from "@/components/public/pages/CmsPageLayout";
import { getPageBySlug } from "@/lib/db/queries/pages";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import { resolveMediaUrl } from "@/lib/media/resolve-url";
import type { BreadcrumbItem } from "@/types/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page?.PageMetaTitle || page?.PageTitle || "Page" };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([getPageBySlug(slug), getGlobalSettings()]);
  if (!page) notFound();

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: page.PageTitle },
  ];

  const bannerSrc = resolveMediaUrl("pages", page.PageImage);

  return (
    <CmsPageLayout
      slug={slug}
      title={page.PageTitle}
      html={page.PageDescription}
      bannerSrc={bannerSrc}
      breadcrumbs={breadcrumbs}
      contactHtml={slug === "contact-us" ? settings?.ConfigContact : undefined}
      mapsHtml={slug === "contact-us" ? settings?.ConfigMaps : undefined}
      workingHoursHtml={slug === "contact-us" ? settings?.ConfigWorkingHours : undefined}
    />
  );
}
