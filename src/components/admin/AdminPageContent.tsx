import { cn } from "@/lib/utils";

export function AdminPageContent({
  children,
  className,
  narrow,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={cn("admin-page-body", narrow && "admin-page-body--narrow", className)}>
      {children}
    </div>
  );
}

export function AdminToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("admin-toolbar", className)}>
      {children}
    </div>
  );
}
