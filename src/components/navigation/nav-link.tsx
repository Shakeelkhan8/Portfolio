"use client";

import { usePathname } from "next/navigation";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type NavLinkProps = {
  item: NavItem;
  className?: string;
  onClick?: () => void;
};

export function NavLink({ item, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <AppLink
      href={item.href}
      external={item.external}
      showExternalIcon={false}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.title}
    </AppLink>
  );
}
