"use client";

import { useRouter } from "next/navigation";

type CategoryOption = {
  slug: string;
  title: string;
  depth: number;
};

type CategorySelectProps = {
  categories: CategoryOption[];
  currentSlug?: string;
  basePath: string;
  label?: string;
};

export function CategorySelect({
  categories,
  currentSlug,
  basePath,
  label = "All Categories",
}: CategorySelectProps) {
  const router = useRouter();

  return (
    <div className="mb-10 flex justify-end">
      <select
        value={currentSlug ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          router.push(val ? `${basePath}/${val}` : basePath);
        }}
        className="rounded-full border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-primary shadow-sm transition-all hover:border-accent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <option value="">{label}</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {"—".repeat(cat.depth)} {cat.title}
          </option>
        ))}
      </select>
    </div>
  );
}
