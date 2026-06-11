import Image from "next/image";
import { Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminLogoProps = {
  logoUrl?: string | null;
  siteName: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { box: "h-9 w-9", image: 36, text: "text-sm" },
  md: { box: "h-11 w-11", image: 44, text: "text-base" },
  lg: { box: "h-16 w-16", image: 64, text: "text-lg" },
} as const;

export function AdminLogo({
  logoUrl,
  siteName,
  size = "md",
  showName = true,
  className,
}: AdminLogoProps) {
  const s = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-primary/10 bg-white shadow-sm",
          s.box
        )}
      >
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={siteName}
            width={s.image}
            height={s.image}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <Landmark className="h-1/2 w-1/2 text-primary/70" strokeWidth={1.5} />
        )}
      </div>
      {showName && (
        <div className="min-w-0">
          <p className={cn("truncate font-serif font-semibold leading-tight text-primary", s.text)}>
            {siteName}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">Admin Panel</p>
        </div>
      )}
    </div>
  );
}
