type WithParent = { [key: string]: number | string };

/** Walk parent chain using a pre-loaded map — one query instead of N. */
export function buildAncestorsFromMap<T extends WithParent>(
  catId: number,
  map: Map<number, T>,
  idKey: keyof T,
  parentKey: keyof T
): T[] {
  const ancestors: T[] = [];
  let current = map.get(catId);

  while (current) {
    const parentId = Number(current[parentKey]);
    if (!parentId) break;
    const parent = map.get(parentId);
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
}
