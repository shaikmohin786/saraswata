export const HOME_SECTIONS = {
  intro: "home-intro",
  legacy: "home-legacy",
  collections: "home-collections",
  news: "home-news",
  gallery: "home-gallery",
  videos: "home-videos",
  achievements: "home-achievements",
  cta: "home-cta",
} as const;

export type HomeSectionId = keyof typeof HOME_SECTIONS;

const STORAGE_KEY = "saraswata-home-return-section";

export function saveHomeReturnSection(section: HomeSectionId) {
  try {
    sessionStorage.setItem(STORAGE_KEY, section);
  } catch {
    /* private browsing */
  }
}

export function peekHomeReturnSection(): HomeSectionId | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (value && value in HOME_SECTIONS) {
      return value as HomeSectionId;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function consumeHomeReturnSection(): HomeSectionId | null {
  const section = peekHomeReturnSection();
  if (!section) return null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return section;
}

export function scrollToHomeSection(
  section: HomeSectionId,
  behavior: ScrollBehavior = "instant"
) {
  const el = document.getElementById(HOME_SECTIONS[section]);
  if (!el) return;

  const headerH =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-h")
    ) || 72;

  const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
  window.scrollTo({ top: Math.max(0, top), behavior });
}
