import type { MenuListItem } from "@/types/cms";

/**
 * Synchronous menu href builder — avoids per-item DB queries.
 * Legacy: site_url(MenuParameter + MenuSlug)
 */
export function buildMenuHrefSync(
  item: MenuListItem,
  hasChildren: boolean,
  pageSlugById: Map<number, string>
): string {
  if (hasChildren) return "#";
  if (item.MenuType === "External") return item.MenuParameter || "#";
  if (item.MenuType === "#") return "#";
  if (item.MenuType === "Homepage") return "/";

  let param = item.MenuParameter ?? "";
  let slug = item.MenuSlug ?? "";

  if (item.MenuPostType === 2 && item.MenuPostID) {
    const pageSlug = pageSlugById.get(item.MenuPostID);
    if (pageSlug) slug = pageSlug;
  }

  const combined = `${param}${slug}`.replace(/\/+/g, "/");
  // Broken/empty menu rows must not silently route to homepage
  if (!combined || combined === "/") return hasChildren ? "#" : "#";

  const path = combined.startsWith("/") ? combined : `/${combined}`;
  return path.replace(/\/+$/, "") || "/";
}
