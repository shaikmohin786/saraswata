import Link from "next/link";
import { MapPin, Clock, Mail, ArrowUp } from "lucide-react";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";

type SiteFooterProps = {
  siteName: string;
  footerText: string;
  contactHtml: string;
  workingHoursHtml: string;
  social: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    pinterest?: string;
  };
};

const socialLabels: Record<string, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  pinterest: "Pinterest",
};

export function SiteFooter({
  siteName,
  footerText,
  contactHtml,
  workingHoursHtml,
  social,
}: SiteFooterProps) {
  const socialLinks = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="mt-auto w-full max-w-[100vw] overflow-x-clip">
      {/* Cream contact strip — compact 3 columns like legacy site */}
      <div className="border-t border-[var(--border)] bg-footer-warm">
        <div className="site-container py-6 sm:py-8">
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-4">
            {/* Find Us */}
            <div className="min-w-0 text-center sm:text-left">
              <h3 className="mb-2 flex items-center justify-center gap-1.5 font-serif text-sm font-semibold text-primary sm:justify-start">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Find Us
              </h3>
              <p className="text-xs leading-relaxed text-muted sm:text-sm">
                Vetapalem, Prakasam District
                <br />
                Andhra Pradesh, India
              </p>
              <Link
                href="/page/contact-us"
                className="mt-2 inline-block text-xs font-semibold text-accent underline-offset-2 hover:underline"
              >
                View map & directions →
              </Link>
            </div>

            {/* Working Hours */}
            <div className="min-w-0 rounded border border-[var(--border)] bg-white/60 px-4 py-3 text-center">
              <h3 className="mb-2 flex items-center justify-center gap-1.5 font-serif text-sm font-semibold text-primary">
                <Clock className="h-3.5 w-3.5 text-accent" />
                Working Hours
              </h3>
              {workingHoursHtml ? (
                <div
                  className="cms-prose text-xs text-muted [&_*]:text-muted sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(workingHoursHtml) }}
                />
              ) : (
                <p className="text-xs text-muted sm:text-sm">8 a.m. to 11 a.m. and 3 to 6 p.m.</p>
              )}
            </div>

            {/* Stay in Touch */}
            <div className="min-w-0 text-center sm:text-left">
              <h3 className="mb-2 flex items-center justify-center gap-1.5 font-serif text-sm font-semibold text-primary sm:justify-start">
                <Mail className="h-3.5 w-3.5 text-accent" />
                Stay in Touch
              </h3>
              {contactHtml ? (
                <div
                  className="cms-prose text-xs text-muted [&_*]:text-muted [&_a]:text-accent sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(contactHtml) }}
                />
              ) : (
                <p className="text-xs text-muted sm:text-sm">
                  <Link href="/page/contact-us" className="text-accent hover:underline">Contact us</Link> for enquiries.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terracotta bottom bar — copyright + social */}
      <div className="bg-footer-bar text-white">
        <div className="site-container flex flex-col items-center justify-between gap-3 py-3 sm:flex-row sm:py-3.5">
          <p className="text-center text-[11px] text-white/90 sm:text-left sm:text-xs">
            {footerText || `© ${new Date().getFullYear()} ${siteName}. All Rights Reserved.`}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {socialLinks.map(([key, url]) => (
              <Link
                key={key}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded px-2 py-1 text-[10px] font-medium text-white/85 transition-colors hover:bg-white/15 hover:text-white sm:text-xs"
                aria-label={socialLabels[key] ?? key}
              >
                {socialLabels[key] ?? key}
              </Link>
            ))}
            <a
              href="#top"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded bg-white/15 text-white transition-colors hover:bg-white/25"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
