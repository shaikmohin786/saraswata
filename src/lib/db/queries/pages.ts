import { queryOne } from "@/lib/db/connection";
import type { CmsPage } from "@/types/cms";

const ACTIVE = "PageStatus = 0 AND PageDelete = 0";

export async function getPageBySlug(slug: string) {
  return queryOne<CmsPage>(
    `SELECT PageID, PageTitle, PageTitleAlias, PageDescription, PageImage,
            PageMetaTitle, PageMetaDescription
     FROM pages WHERE ${ACTIVE} AND PageTitleAlias = ? LIMIT 1`,
    [slug]
  );
}
