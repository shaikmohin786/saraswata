"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Files,
  Image,
  Video,
  Menu,
  SlidersHorizontal,
  Settings,
  Users,
  Trash2,
  Database,
  UserCircle,
  ExternalLink,
  X,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminLogo } from "@/components/admin/AdminLogo";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/posts", label: "Posts", icon: FileText },
      { href: "/admin/pages", label: "Pages", icon: Files },
      { href: "/admin/gallery", label: "Gallery", icon: Image },
      { href: "/admin/videos", label: "Videos", icon: Video },
    ],
  },
  {
    title: "Site",
    items: [
      { href: "/admin/menu", label: "Menu", icon: Menu },
      { href: "/admin/sliders", label: "Sliders", icon: SlidersHorizontal },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/trash", label: "Trash", icon: Trash2 },
      { href: "/admin/backup", label: "Backup", icon: Database },
    ],
  },
  {
    title: "Account",
    items: [{ href: "/admin/profile", label: "Profile", icon: UserCircle }],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

type AdminSidebarProps = {
  logoUrl?: string | null;
  siteName: string;
};

export function AdminSidebar({ logoUrl, siteName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="border-b border-[var(--border)] px-4 py-4">
        <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)}>
          <AdminLogo logoUrl={logoUrl} siteName={siteName} size="sm" />
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "admin-nav-link flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-white shadow-sm shadow-primary/15"
                        : "text-primary/75 hover:bg-secondary hover:text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        <Link
          href="/"
          className="admin-nav-link flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-secondary hover:text-primary"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View website
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="admin-mobile-toggle fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-primary shadow-md lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
      >
        <PanelLeft className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu overlay"
        />
      )}

      <aside
        className={cn(
          "admin-sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border)] bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-secondary hover:text-primary lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
        {navContent}
      </aside>
    </>
  );
}
