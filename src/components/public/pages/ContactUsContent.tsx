import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Heart } from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";

type ContactUsContentProps = {
  html: string;
  contactHtml?: string;
  mapsHtml?: string;
  workingHoursHtml?: string;
};

function stripTags(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseContactHtml(html: string) {
  const sanitized = sanitizeCmsHtml(html);
  const text = stripTags(sanitized);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/(?:\+91\s?)?[\d\s-]{10,}/);
  const email = emailMatch?.[0] ?? null;
  const phone = phoneMatch?.[0]?.replace(/\s+/g, " ").trim() ?? null;

  let address = text;
  if (email) address = address.replace(email, "");
  if (phone) address = address.replace(phone, "");
  address = address.replace(/^[\s,;-]+|[\s,;-]+$/g, "").trim();

  if (!address) {
    address = "Saraswata Niketanam, Vetapalem, Chirala, Andhra Pradesh, India - 523187";
  }

  return {
    email: email ?? "contact@saraswataniketanam.in",
    phone: phone ?? "+91 9493333222",
    address,
  };
}

function isTrivialPageHtml(html: string, title = "contact") {
  const text = stripTags(sanitizeCmsHtml(html)).toLowerCase();
  return !text || text === title || text === "contact us" || text.length < 20;
}

function ContactCard({
  icon: Icon,
  label,
  children,
  href,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient/30 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-primary">{children}</div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-xl border border-[var(--border)] bg-white px-4 py-4 transition-colors hover:border-accent/40 hover:bg-[var(--cream)]"
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-4">{inner}</div>
  );
}

export function ContactUsContent({
  html,
  contactHtml,
  mapsHtml,
  workingHoursHtml,
}: ContactUsContentProps) {
  const contact = parseContactHtml(contactHtml || "");
  const showIntro = !isTrivialPageHtml(html);
  const phoneHref = contact.phone.replace(/[^\d+]/g, "");

  return (
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        {showIntro ? (
          <div
            className="cms-prose max-w-2xl text-base text-muted sm:text-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html) }}
          />
        ) : (
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Whether you are planning a visit, seeking research access, or wishing to support our
            work — we would be glad to hear from you.
          </p>
        )}
      </FadeIn>

      <FadeIn delay={0.06}>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
          <ContactCard icon={Mail} label="Email" href={`mailto:${contact.email}`}>
            <span className="break-all font-medium text-accent">{contact.email}</span>
          </ContactCard>

          <ContactCard icon={Phone} label="Phone" href={`tel:${phoneHref}`}>
            <span className="font-medium">{contact.phone}</span>
          </ContactCard>

          <ContactCard icon={MapPin} label="Address">
            <address className="not-italic">{contact.address}</address>
          </ContactCard>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-warm-gradient px-4 py-4 sm:flex-row sm:items-start sm:gap-5 sm:px-5">
          <div className="flex shrink-0 items-center gap-2">
            <Clock className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Working Hours
            </p>
          </div>
          {workingHoursHtml ? (
            <div
              className="cms-prose text-sm leading-relaxed text-muted [&_*]:text-sm [&_*]:text-muted"
              dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(workingHoursHtml) }}
            />
          ) : (
            <p className="text-sm text-muted">
              8 a.m. to 11 a.m. · 3 p.m. to 6 p.m. · Friday weekly holiday
            </p>
          )}
        </div>
      </FadeIn>

      {mapsHtml && (
        <FadeIn delay={0.14}>
          <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-sm">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                Find us on the map
              </p>
            </div>
            <div className="[&_iframe]:block [&_iframe]:aspect-[16/10] [&_iframe]:min-h-[240px] [&_iframe]:w-full sm:[&_iframe]:min-h-[320px]">
              <div dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(mapsHtml) }} />
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.18}>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-section-alt px-4 py-4 sm:px-5">
          <p className="text-sm text-muted">
            Wish to support our preservation work?
          </p>
          <Link href="/page/support-us" className="btn-primary shrink-0 py-2.5 text-[11px]">
            <Heart className="h-3.5 w-3.5" />
            Donate
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
