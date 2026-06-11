"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type HomeBackLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href?: "/";
};

export function HomeBackLink({
  className,
  href = "/",
  scroll = false,
  ...props
}: HomeBackLinkProps) {
  return <Link href={href} scroll={scroll} className={cn(className)} {...props} />;
}
