import type { Field } from "@/components/admin/CrudForm";

export const seoFields = (data: Record<string, unknown>, prefix: string): Field[] => [
  { name: "metaTitle", label: "Meta Title", defaultValue: (data[`${prefix}MetaTitle`] as string) ?? "" },
  { name: "metaDescription", label: "Meta Description", type: "textarea", rows: 3, defaultValue: (data[`${prefix}MetaDescription`] as string) ?? "" },
  { name: "metaKeywords", label: "Meta Keywords", defaultValue: (data[`${prefix}MetaKeywords`] as string) ?? "" },
];

export const statusField = (value: number): Field => ({
  name: "status",
  label: "Status",
  type: "select",
  defaultValue: value,
  options: [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
  ],
});

export function categoryFields(
  data: Record<string, unknown>,
  parents: { id: number; title: string }[],
  prefix: string,
  imageFolder: string
): Field[] {
  const parentKey = prefix === "PostCategory" ? "PostCategoryParentID"
    : prefix === "GalleryCategory" ? "GalleryCategoryParentID" : "VideoCategoryParentID";
  const orderKey = prefix === "PostCategory" ? "PostCategoryOrdering"
    : prefix === "GalleryCategory" ? "GalleryCategoryOrdering" : "VideoCategoryOrdering";

  return [
    { name: "title", label: "Title", defaultValue: (data[`${prefix}Title`] as string) ?? "" },
    { name: "alias", label: "URL Slug", defaultValue: (data[`${prefix}TitleAlias`] as string) ?? "" },
    {
      name: "parentId", label: "Parent Category", type: "select",
      defaultValue: (data[parentKey] as number) ?? 0,
      options: [{ value: 0, label: "None (top level)" }, ...parents.map((p) => ({ value: p.id, label: p.title }))],
    },
    { name: "image", label: "Category Image", type: "image", uploadCategory: `${imageFolder}/category`, defaultValue: (data[`${prefix}Image`] as string) ?? "" },
    { name: "headerImage", label: "Header Banner Image", type: "image", uploadCategory: `${imageFolder}/category`, defaultValue: (data[`${prefix}HeaderImage`] as string) ?? "" },
    { name: "ordering", label: "Ordering", type: "number", defaultValue: (data[orderKey] as number) ?? 0 },
    statusField((data[`${prefix}Status`] as number) ?? 0),
    ...seoFields(data, prefix),
  ];
}
