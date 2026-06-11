import Link from "next/link";
import { HomeSectionLink } from "@/components/public/shared/HomeSectionLink";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Landmark,
  ImageIcon,
  Users,
  Heart,
  Clock,
  MapPin,
  Phone,
  Award,
  Library,
} from "lucide-react";
import { FadeIn } from "@/components/public/shared/FadeIn";
import { LegacyTimeline } from "@/components/public/home/LegacyTimeline";
import { FeaturedCollectionsGrid } from "@/components/public/home/FeaturedCollectionsGrid";
import { NewsPreviewSection } from "@/components/public/home/NewsPreviewSection";
import { VideoPreviewSection } from "@/components/public/home/VideoPreviewSection";
import { siteConfig } from "@/config/site";
import { sanitizeCmsHtml } from "@/lib/html/sanitize";

const ICONS = [Landmark, BookOpen, ImageIcon, Users];

/* ─── Stats — clean inline strip below hero ─── */
export function StatsBar() {
  const stats = [
    { value: "1918", label: "Year Founded" },
    { value: "100+", label: "Years of Service" },
    { value: "10K+", label: "Rare Volumes" },
    { value: "1", label: "Gandhian Legacy" },
  ];

  return (
    <section className="border-y border-[var(--border)] bg-white">
      <div className="site-container py-6 sm:py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.06}>
              <div className="min-w-0 text-center md:border-r md:border-[var(--border)] md:last:border-r-0">
                <p className="font-serif text-2xl font-semibold text-primary sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:text-xs">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Institution Overview ─── */
export function IntroSection({ title }: { title: string }) {
  const paragraphs = siteConfig.institutionOverview;

  return (
    <section id="home-intro" className="section-padding section-connector-top scroll-mt-[var(--header-h)] bg-warm-gradient">
      <div className="site-container">
        <div className="grid items-center gap-8 lg:grid-cols-5 lg:gap-16">
          <FadeIn className="min-w-0 lg:col-span-2">
            <p className="section-label mb-3">Institution Overview</p>
            <h2 className="heading-section text-primary">{title}</h2>
            <div className="mt-5 accent-line" />
            <p className="mt-6 text-base leading-relaxed text-muted">
              One of India&apos;s oldest privately managed libraries — a living monument to knowledge, culture and the Gandhian spirit in Vetapalem, Andhra Pradesh.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <HomeSectionLink href="/page/about-us" section="intro" className="btn-primary w-full sm:w-auto">
                Our Story <ArrowRight className="h-4 w-4" />
              </HomeSectionLink>
              <HomeSectionLink href="/page/collection-of-books" section="intro" className="btn-outline-dark w-full sm:w-auto">
                Rare Collection
              </HomeSectionLink>
            </div>
          </FadeIn>

          <FadeIn delay={0.12} className="min-w-0 lg:col-span-3">
            <div className="relative border-l-4 border-accent bg-white p-5 shadow-lg shadow-primary/5 sm:p-7 md:p-9">
              <div className="institution-prose text-muted">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Legacy / History Timeline ─── */
export function LegacySection() {
  return <LegacyTimeline />;
}

/* ─── Featured Collections ─── */
export function FeaturedCollections() {
  return <FeaturedCollectionsGrid />;
}

/* ─── Quick Navigation ─── */
export function QuickLinks({ links }: { links: { title: string; href: string; desc: string }[] }) {
  return (
    <section className="section-padding bg-white">
      <div className="site-container">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-10">
            <p className="section-label">Navigate</p>
            <h2 className="mt-3 heading-section text-primary">Explore the Library</h2>
          </div>
        </FadeIn>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((link, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <FadeIn key={link.href} delay={i * 0.06}>
                <Link href={link.href} className="hover-glow group block border border-[var(--border)] bg-white p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center bg-gold-gradient text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-primary transition-colors group-hover:text-accent">{link.title}</h3>
                  <p className="mt-1.5 text-sm text-muted">{link.desc}</p>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type PreviewItem = {
  id: number;
  title: string;
  href: string;
  imageUrl: string | null;
  excerpt?: string;
  date?: string;
};

/* ─── News & Events Preview ─── */
export function NewsPreview({
  heading,
  subtitle,
  items,
  viewAllHref,
}: {
  heading: string;
  subtitle?: string;
  items: PreviewItem[];
  viewAllHref: string;
}) {
  return (
    <NewsPreviewSection
      heading={heading}
      subtitle={subtitle}
      items={items}
      viewAllHref={viewAllHref}
    />
  );
}

/* ─── Gallery Preview (masonry-style) ─── */
export function GalleryPreview({
  items,
  viewAllHref,
}: {
  items: PreviewItem[];
  viewAllHref: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-hero-gradient">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeIn>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label mb-3 text-accent-light">Visual Archives</p>
              <h2 className="font-serif text-3xl font-semibold text-white md:text-4xl">Featured Gallery</h2>
              <p className="mt-3 max-w-lg text-white/65">Historic photographs documenting our institution&apos;s journey.</p>
            </div>
            <Link href={viewAllHref} className="btn-outline shrink-0 border-accent/50 text-accent hover:bg-accent hover:text-primary">
              View Gallery <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((item, i) => (
            <FadeIn key={item.id} delay={i * 0.06}>
              <Link
                href={item.href}
                className={`group relative block overflow-hidden rounded-lg img-zoom-wrap ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto md:min-h-[280px]" : "aspect-square"}`}
              >
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill className="img-zoom-target object-cover" sizes="(max-width:768px) 50vw, 25vw" />
                ) : (
                  <div className="flex h-full min-h-[120px] items-center justify-center bg-white/10">◈</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="absolute bottom-0 left-0 right-0 p-3 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Video Highlights ─── */
export function VideoPreview({
  heading = "Video Highlights",
  subtitle = "Documentaries and recordings from our archives.",
  items,
  viewAllHref,
}: {
  heading?: string;
  subtitle?: string;
  items: PreviewItem[];
  viewAllHref: string;
}) {
  return (
    <VideoPreviewSection
      heading={heading}
      subtitle={subtitle}
      items={items}
      viewAllHref={viewAllHref}
    />
  );
}

/* ─── Library Achievements ─── */
export function AchievementsSection() {
  const achievements = [
    { icon: Award, title: "Heritage Recognition", desc: "Acknowledged as a significant cultural and literary institution in Andhra Pradesh." },
    { icon: BookOpen, title: "Scholarly Resource", desc: "Trusted by researchers, historians and students across India." },
    { icon: Users, title: "Community Hub", desc: "A gathering place for readers, thinkers and cultural enthusiasts since 1918." },
  ];

  return (
    <section id="home-achievements" className="section-padding scroll-mt-[var(--header-h)] bg-section-alt">
      <div className="site-container">
        <FadeIn>
          <div className="mb-8 text-center sm:mb-10">
            <p className="section-label">Recognition</p>
            <h2 className="mt-3 heading-section text-primary">Library Achievements</h2>
            <div className="mx-auto mt-5 accent-line accent-line-center" />
          </div>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <FadeIn key={a.title} delay={i * 0.08}>
                <article className="text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-white text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-primary">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.desc}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Visitor Information ─── */
export function VisitorInfo({ workingHoursHtml }: { workingHoursHtml?: string }) {
  return (
    <section className="section-padding bg-white">
      <div className="site-container">
        <div className="overflow-hidden rounded-lg bg-hero-gradient sm:rounded-xl">
          <div className="grid md:grid-cols-2">
            <FadeIn className="p-6 sm:p-8 md:p-12">
              <p className="section-label mb-3 text-accent-light">Plan Your Visit</p>
              <h2 className="heading-section text-white">Visitor Information</h2>
              <p className="mt-4 text-white/70">
                We welcome scholars, students, researchers and visitors. Please check our working hours before planning your visit.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-white">Location</p>
                    <p className="text-sm text-white/65">Vetapalem, Prakasam District, Andhra Pradesh</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-white">Working Hours</p>
                    {workingHoursHtml ? (
                      <div className="cms-prose text-sm text-white/65 [&_*]:text-white/65" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(workingHoursHtml) }} />
                    ) : (
                      <p className="text-sm text-white/65">Please contact us for current visiting hours.</p>
                    )}
                  </div>
                </div>
              </div>
              <Link href="/page/contact-us" className="btn-primary mt-6 w-full sm:mt-8 sm:w-auto">
                Get Directions <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeIn>
            <FadeIn delay={0.1} className="relative min-h-[200px] bg-primary-light/30 sm:min-h-[280px]">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <Landmark className="mx-auto h-16 w-16 text-accent/40" />
                  <p className="mt-4 font-serif text-2xl text-white/80">Saraswata Niketanam</p>
                  <p className="mt-2 text-sm text-white/50">Est. 1918 · Vetapalem</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Highlights ─── */
export function ContactHighlights({ contactHtml }: { contactHtml?: string }) {
  return (
    <section className="section-padding bg-warm-gradient">
      <div className="site-container">
        <FadeIn>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="min-w-0 md:col-span-1">
              <p className="section-label mb-3">Connect</p>
              <h2 className="heading-section text-primary">Contact Highlights</h2>
              <p className="mt-3 text-sm text-muted">Reach out for visits, research enquiries or general information.</p>
              <Link href="/page/contact-us" className="btn-outline-dark mt-6">
                <Phone className="h-3.5 w-3.5" /> Full Contact Page
              </Link>
            </div>
            <div className="md:col-span-2">
              <div className="rounded-xl border border-[var(--border)] bg-white p-7">
                {contactHtml ? (
                  <div className="cms-prose text-sm" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(contactHtml) }} />
                ) : (
                  <p className="text-muted">Visit our contact page for address, phone and email details.</p>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Support CTA — warm gold, not dark duplicate ─── */
export function HomeCta() {
  return (
    <section id="home-cta" className="scroll-mt-[var(--header-h)] border-y border-[var(--border)] bg-warm-gradient py-10 sm:py-12">
      <div className="site-container relative max-w-3xl text-center">
        <FadeIn>
          <Heart className="mx-auto h-7 w-7 text-accent" />
          <h2 className="mt-4 heading-section text-primary">
            Help Preserve a Century of Knowledge
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
            Support Saraswata Niketanam and help us continue safeguarding rare books, manuscripts and cultural heritage.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <HomeSectionLink href="/page/support-us" section="cta" className="btn-primary w-full sm:w-auto">
              Support Us <ArrowRight className="h-4 w-4" />
            </HomeSectionLink>
            <HomeSectionLink href="/page/contact-us" section="cta" className="btn-outline-dark w-full sm:w-auto">
              Contact Us
            </HomeSectionLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
