"use client";

import Link from "next/link";
import {
  saveHomeReturnSection,
  type HomeSectionId,
} from "@/lib/navigation/home-section";

type HomeSectionLinkProps = React.ComponentProps<typeof Link> & {
  section: HomeSectionId;
};

export function HomeSectionLink({
  section,
  onClick,
  ...props
}: HomeSectionLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        saveHomeReturnSection(section);
        onClick?.(e);
      }}
    />
  );
}
