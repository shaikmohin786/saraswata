import { queryOne } from "@/lib/db/connection";
import type { MenuListItem } from "@/types/cms";
import { buildMenuHrefSync } from "@/lib/menu/build-href-sync";

/** @deprecated Prefer buildMenuHrefSync with a pre-loaded page slug map. */
export async function buildMenuHref(
  item: MenuListItem,
  hasChildren = false
): Promise<string> {
  const pageSlugById = new Map<number, string>();
  if (item.MenuPostType === 2 && item.MenuPostID) {
    const page = await queryOne<{ PageTitleAlias: string }>(
      "SELECT PageTitleAlias FROM pages WHERE PageID = ? AND PageDelete = 0 AND PageStatus = 0 LIMIT 1",
      [item.MenuPostID]
    );
    if (page) pageSlugById.set(item.MenuPostID, page.PageTitleAlias);
  }
  return buildMenuHrefSync(item, hasChildren, pageSlugById);
}
