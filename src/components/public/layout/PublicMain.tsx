"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function PublicMain({ children }: { children: React.ReactNode }) {
  const isHome = usePathname() === "/";

  return (
    <main
      className={cn(
        "flex-1 w-full max-w-[100vw] overflow-x-clip",
        !isHome && "pt-[var(--header-h)]"
      )}
    >
      {children}
    </main>
  );
}
