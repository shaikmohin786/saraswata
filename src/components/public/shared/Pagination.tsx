import Link from "next/link";
import { getPageNumbers } from "@/lib/pagination";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const href = (page: number) => (page <= 1 ? basePath : `${basePath}/${page}`);

  return (
    <nav aria-label="Pagination" className="mt-14 flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium text-primary transition-all hover:border-accent hover:text-accent"
        >
          Previous
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={href(page)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all",
            page === currentPage
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "border border-[var(--border)] text-primary hover:border-accent hover:text-accent"
          )}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          className="rounded-full border border-[var(--border)] px-5 py-2 text-sm font-medium text-primary transition-all hover:border-accent hover:text-accent"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
