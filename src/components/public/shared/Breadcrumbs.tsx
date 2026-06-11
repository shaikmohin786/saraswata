import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HomeBackLink } from "@/components/public/shared/HomeBackLink";
import { cn } from "@/lib/utils";
import type { BreadcrumbItem } from "@/types/cms";

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-muted", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-35" />}
          {item.href ? (
            item.href === "/" ? (
              <HomeBackLink className="transition-colors hover:text-primary">
                {item.label}
              </HomeBackLink>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            )
          ) : (
            <span className="font-medium text-primary/80">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  );
}
