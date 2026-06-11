export function getPageNumbers(current: number, total: number): number[] {
  const pages: number[] = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

export function buildPageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  return `${basePath}/${page}`;
}
