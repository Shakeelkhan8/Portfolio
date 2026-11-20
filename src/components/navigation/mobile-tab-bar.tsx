"use client";

import {
  BookOpen,
  Briefcase,
  FolderKanban,
  Home,
  Mail,
  MoreHorizontal,
  User,
  type LucideIcon,
} from "lucide-react";
import { m } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet";
import { routes } from "@/config/navigation";
import type { NavigationData, PublicSiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

type MobileTabBarProps = {
  site: PublicSiteConfig;
  navigation: NavigationData;
};

const ICON_BY_HREF: Record<string, LucideIcon> = {
  [routes.home]: Home,
  [routes.about]: User,
  [routes.projects]: FolderKanban,
  [routes.writing]: BookOpen,
  [routes.experience]: Briefcase,
  [routes.contact]: Mail,
};

function resolveIcon(href: string): LucideIcon {
  if (ICON_BY_HREF[href]) return ICON_BY_HREF[href]!;
  if (href.startsWith("/projects")) return FolderKanban;
  if (href.startsWith("/writing")) return BookOpen;
  return FolderKanban;
}

function isTabActive(pathname: string, href: string) {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * App-style bottom navigation — primary destinations from CMS mainNav.
 * “More” opens the full immersive sheet (utility + social).
 */
export function MobileTabBar({ site, navigation }: MobileTabBarProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const tabs = useMemo(() => {
    const home: NavItem = { title: "Home", href: routes.home };
    // About stays one tap away in the "More" sheet.
    const preferred = [
      routes.projects,
      routes.experience,
      routes.writing,
      routes.contact,
      routes.about,
    ];
    const fromCms = preferred
      .map((href) => navigation.mainNav.find((item) => item.href === href))
      .filter((item): item is NavItem => Boolean(item));
    const rest = navigation.mainNav.filter(
      (item) => !fromCms.some((t) => t.href === item.href),
    );
    const primary = [home, ...fromCms, ...rest].slice(0, 4);
    return primary;
  }, [navigation.mainNav]);

  return (
    <>
      <nav
        aria-label="Primary mobile navigation"
        className="mobile-tab-bar md:hidden"
      >
        <div className="mobile-tab-bar__inner">
          {tabs.map((item) => {
            const Icon = resolveIcon(item.href);
            const active = isTabActive(pathname, item.href);
            return (
              <AppLink
                key={item.href}
                href={item.href}
                showExternalIcon={false}
                className={cn(
                  "mobile-tab-bar__item",
                  active && "mobile-tab-bar__item--active",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="mobile-tab-bar__icon-wrap">
                  {active ? (
                    <m.span
                      layoutId="mobile-tab-indicator"
                      className="mobile-tab-bar__indicator"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  ) : null}
                  <Icon className="size-[1.15rem]" strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span className="mobile-tab-bar__label">{item.title}</span>
              </AppLink>
            );
          })}

          <button
            type="button"
            className={cn(
              "mobile-tab-bar__item",
              moreOpen && "mobile-tab-bar__item--active",
            )}
            aria-label="Open more navigation"
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen(true)}
          >
            <span className="mobile-tab-bar__icon-wrap">
              <MoreHorizontal className="size-[1.15rem]" strokeWidth={1.75} />
            </span>
            <span className="mobile-tab-bar__label">More</span>
          </button>
        </div>
      </nav>

      <MobileNavSheet
        site={site}
        navigation={navigation}
        open={moreOpen}
        onOpenChange={setMoreOpen}
      />
    </>
  );
}
