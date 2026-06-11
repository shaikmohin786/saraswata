import { unstable_cache } from "next/cache";
import { query } from "@/lib/db/connection";
import { getGlobalSettings } from "@/lib/db/queries/settings";
import { buildMenuTree, getActiveMenuItems } from "@/lib/db/queries/menu";
import { buildMenuHrefSync } from "@/lib/menu/build-href-sync";
import type { MenuListItem } from "@/types/cms";
import type { MenuTreeItem } from "@/lib/db/queries/menu";

export type NavItem = {
  id: number;
  title: string;
  href: string;
  children: NavItem[];
};

async function loadPageSlugMap(menuItems: MenuListItem[]) {
  const pageIds = [
    ...new Set(
      menuItems
        .filter((m) => m.MenuPostType === 2 && m.MenuPostID > 0)
        .map((m) => m.MenuPostID)
    ),
  ];
  if (pageIds.length === 0) return new Map<number, string>();

  const placeholders = pageIds.map(() => "?").join(",");
  const rows = await query<{ PageID: number; PageTitleAlias: string }>(
    `SELECT PageID, PageTitleAlias FROM pages
     WHERE PageDelete = 0 AND PageStatus = 0 AND PageID IN (${placeholders})`,
    pageIds
  );
  return new Map(rows.map((r) => [r.PageID, r.PageTitleAlias]));
}

function mapMenuTreeSync(
  items: MenuTreeItem[],
  pageSlugById: Map<number, string>
): NavItem[] {
  return items.map((item) => ({
    id: item.MenuID,
    title: item.MenuTitle,
    href: buildMenuHrefSync(item, item.children.length > 0, pageSlugById),
    children: mapMenuTreeSync(item.children, pageSlugById),
  }));
}

async function fetchPublicLayoutData() {
  const [settings, menuItems] = await Promise.all([
    getGlobalSettings(),
    getActiveMenuItems(),
  ]);

  const pageSlugById = await loadPageSlugMap(menuItems);
  const menu = mapMenuTreeSync(buildMenuTree(menuItems), pageSlugById);

  return { settings, menu };
}

export const getPublicLayoutData = unstable_cache(
  fetchPublicLayoutData,
  ["public-layout-data"],
  { revalidate: 120, tags: ["cms-layout"] }
);
