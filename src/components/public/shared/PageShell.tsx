import { Breadcrumbs } from "./Breadcrumbs";
import { SectionBanner } from "./SectionBanner";
import { FadeIn } from "./FadeIn";
import type { BreadcrumbItem } from "@/types/cms";

type PageShellProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  bannerSrc?: string | null;
  bannerAlt?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function PageShell({
  title,
  breadcrumbs,
  bannerSrc,
  bannerAlt,
  subtitle,
  children,
}: PageShellProps) {
  return (
    <>
      <SectionBanner src={bannerSrc ?? null} alt={bannerAlt ?? title} title={title} />
      <div className="site-container page-content">
        <FadeIn>
          <Breadcrumbs items={breadcrumbs} className="mb-8" />
          {subtitle && (
            <p className="-mt-4 mb-10 max-w-2xl text-base leading-relaxed text-muted">{subtitle}</p>
          )}
        </FadeIn>
        <FadeIn delay={0.1}>{children}</FadeIn>
      </div>
    </>
  );
}
