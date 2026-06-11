import type { LucideIcon } from "lucide-react";
import { BookOpen, Landmark, Users } from "lucide-react";

export type StoryPageMeta = {
  icon: LucideIcon;
  label: string;
  subtitle: string;
  glance: string[];
  related: { title: string; href: string }[];
};

export const STORY_PAGE_META: Record<string, StoryPageMeta> = {
  "about-us": {
    icon: Landmark,
    label: "Our Story",
    subtitle:
      "A century of preserving knowledge, culture, and Gandhian heritage in Vetapalem.",
    glance: ["Established 1918", "Vetapalem, Andhra Pradesh", "Heritage research library"],
    related: [
      { title: "Our Founder", href: "/page/founder" },
      { title: "Full History", href: "/page/history" },
      { title: "Rare Collection", href: "/page/collection-of-books" },
    ],
  },
  founder: {
    icon: Landmark,
    label: "Founder",
    subtitle: "The life and legacy of Sri V.V. Subroya Shreshty.",
    glance: ["Sri V.V. Subroya Shreshty", "Est. 1918", "Saved & rebuilt the library"],
    related: [
      { title: "About the Library", href: "/page/about-us" },
      { title: "Our History", href: "/page/history" },
      { title: "Support Us", href: "/page/support-us" },
    ],
  },
  "collection-of-books": {
    icon: BookOpen,
    label: "Rare Collection",
    subtitle: "Treasured books, manuscripts, and scholarly works spanning centuries.",
    glance: ["10,000+ volumes", "Palm-leaf manuscripts", "Gandhian literature"],
    related: [
      { title: "About Us", href: "/page/about-us" },
      { title: "Photo Gallery", href: "/gallery" },
      { title: "Support Preservation", href: "/page/support-us" },
    ],
  },
  history: {
    icon: Landmark,
    label: "History",
    subtitle: "Over a hundred years of literary and cultural preservation.",
    glance: ["Founded 1918", "Renamed Saraswata Niketanam", "Gandhian era collections"],
    related: [
      { title: "About Us", href: "/page/about-us" },
      { title: "Our Founder", href: "/page/founder" },
      { title: "Rare Collection", href: "/page/collection-of-books" },
    ],
  },
  "current-management": {
    icon: Users,
    label: "Leadership",
    subtitle: "The volunteer committee that stewards Saraswata Niketanam today.",
    glance: ["Volunteer-led institution", "Community stewardship", "Open to visitors"],
    related: [
      { title: "About Us", href: "/page/about-us" },
      { title: "Contact Us", href: "/page/contact-us" },
      { title: "Memberships", href: "/page/memberships" },
    ],
  },
  management: {
    icon: Users,
    label: "Leadership",
    subtitle: "The volunteer committee that stewards Saraswata Niketanam today.",
    glance: ["Volunteer-led institution", "Community stewardship", "Open to visitors"],
    related: [
      { title: "About Us", href: "/page/about-us" },
      { title: "Contact Us", href: "/page/contact-us" },
      { title: "Memberships", href: "/page/memberships" },
    ],
  },
  memberships: {
    icon: Users,
    label: "Membership",
    subtitle: "Join our community of readers and supporters.",
    glance: ["Reader membership", "Community access", "Support the library"],
    related: [
      { title: "About Us", href: "/page/about-us" },
      { title: "Contact Us", href: "/page/contact-us" },
      { title: "Support Us", href: "/page/support-us" },
    ],
  },
  "press-coverages": {
    icon: BookOpen,
    label: "In the Media",
    subtitle: "Press features and news coverage about Saraswata Niketanam.",
    glance: ["Press archives", "National recognition", "Community stories"],
    related: [
      { title: "Latest Updates", href: "/posts/presscoverages" },
      { title: "About Us", href: "/page/about-us" },
      { title: "Photo Gallery", href: "/gallery" },
    ],
  },
};

export function getStoryPageMeta(slug: string): StoryPageMeta {
  return (
    STORY_PAGE_META[slug] ?? {
      icon: BookOpen,
      label: "Explore",
      subtitle: "Discover more about Saraswata Niketanam.",
      glance: ["Est. 1918", "Vetapalem", "Heritage library"],
      related: [
        { title: "About Us", href: "/page/about-us" },
        { title: "Rare Collection", href: "/page/collection-of-books" },
        { title: "Contact Us", href: "/page/contact-us" },
      ],
    }
  );
}

export function isStoryPage(slug: string) {
  return slug !== "contact-us" && slug !== "support-us";
}
