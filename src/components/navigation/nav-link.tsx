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
        "relative py-2 text-[13px] font-medium tracking-wide transition-all duration-300 after:absolute after:inset-x-1 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:rounded-full after:bg-foreground after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100",
        isActive
          ? "text-foreground after:scale-x-100"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {item.title}
    </AppLink>
  );
}
