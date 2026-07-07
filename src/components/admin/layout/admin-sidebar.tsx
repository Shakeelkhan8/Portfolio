"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { adminNavGroups } from "@/lib/admin/routes";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-5 py-5">
        <Link href="/admin/dashboard" className="block">
          <p className="font-heading text-sm font-semibold">Portfolio CMS</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {adminNavGroups.map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          View site
          <ExternalLink className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
