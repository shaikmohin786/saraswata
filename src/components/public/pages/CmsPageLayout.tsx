import { ArrowLeft } from "lucide-react";
import { HomeBackLink } from "@/components/public/shared/HomeBackLink";
import { SectionBanner } from "@/components/public/shared/SectionBanner";
import { Breadcrumbs } from "@/components/public/shared/Breadcrumbs";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { SupportUsContent } from "@/components/public/pages/SupportUsContent";
import { ContactUsContent } from "@/components/public/pages/ContactUsContent";
import { StoryPageContent } from "@/components/public/pages/StoryPageContent";
import { isStoryPage } from "@/lib/cms/story-pages";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/cms";

type CmsPageLayoutProps = {
  slug: string;
  title: string;
  html: string;
  bannerSrc: string | null;
  breadcrumbs: BreadcrumbItem[];
  contactHtml?: string;
  mapsHtml?: string;
  workingHoursHtml?: string;
};

export function CmsPageLayout({
  slug,
  title,
  html,
  bannerSrc,
  breadcrumbs,
  contactHtml,
  mapsHtml,
  workingHoursHtml,
}: CmsPageLayoutProps) {
  const isContact = slug === "contact-us";
  const isSupport = slug === "support-us";
  const isStory = isStoryPage(slug);
  const compactLayout = isContact || isSupport || isStory;

  return (
    <>
      <SectionBanner src={bannerSrc} alt={title} title={title} />

      <div
        className={cn(
          "site-container",
          compactLayout ? "px-[clamp(1rem,3vw,2.5rem)] py-8 md:py-10" : "page-content"
        )}
      >
        <FadeIn>
          <Breadcrumbs items={breadcrumbs} className={compactLayout ? "mb-5" : "mb-8"} />
        </FadeIn>

        {isContact ? (
          <ContactUsContent
            html={html}
            contactHtml={contactHtml}
            mapsHtml={mapsHtml}
            workingHoursHtml={workingHoursHtml}
          />
        ) : isSupport ? (
          <SupportUsContent title={title} html={html} />
        ) : (
          <StoryPageContent slug={slug} html={html} />
        )}

        <FadeIn delay={0.2}>
          <div className="mt-10 border-t border-[var(--border)] pt-6">
            <HomeBackLink className="back-link">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </HomeBackLink>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
