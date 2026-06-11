"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

type AdminHeaderProps = {
  title: string;
  userName?: string | null;
  description?: string;
  actions?: React.ReactNode;
};

export function AdminHeader({ title, userName, description, actions }: AdminHeaderProps) {
  return (
    <header className="admin-topbar sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-md">
      <div className="admin-page-body flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
        <div className="min-w-0">
          <h1 className="font-serif text-xl font-semibold tracking-tight text-primary sm:text-2xl">
            {title}
          </h1>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          {actions}
          {userName && (
            <span className="admin-user-pill hidden items-center gap-1.5 sm:inline-flex">
              <User className="h-3.5 w-3.5 text-primary/60" />
              {userName}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
