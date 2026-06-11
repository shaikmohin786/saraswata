import { query } from "@/lib/db/connection";
import type { MenuListItem } from "@/types/cms";

export async function getActiveMenuItems() {
  return query<MenuListItem>(
    "SELECT * FROM menu_list WHERE MenuStatus = 0 AND MenuDelete = 0 ORDER BY MenuOrdering ASC"
  );
}

export type MenuTreeItem = MenuListItem & { children: MenuTreeItem[] };

export function buildMenuTree(items: MenuListItem[]): MenuTreeItem[] {
  const map = new Map<number, MenuTreeItem>();

  for (const item of items) {
    map.set(item.MenuID, { ...item, children: [] });
  }

  const roots: MenuTreeItem[] = [];

  for (const item of items) {
    const node = map.get(item.MenuID)!;
    if (item.MenuParentID && map.has(item.MenuParentID)) {
      map.get(item.MenuParentID)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
