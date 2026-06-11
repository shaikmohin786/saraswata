"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { consumeHomeReturnSection, scrollToHomeSection } from "@/lib/navigation/home-section";

export function HomeScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const section = consumeHomeReturnSection();
    if (!section) return;

    const restore = () => scrollToHomeSection(section, "instant");

    requestAnimationFrame(() => {
      requestAnimationFrame(restore);
    });
  }, [pathname]);

  return null;
}
