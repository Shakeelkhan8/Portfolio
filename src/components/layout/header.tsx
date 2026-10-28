"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { NavBar } from "@/components/navigation/nav-bar";
import { MobileNavSheet } from "@/components/navigation/mobile-nav-sheet";
import { Container } from "@/components/layout/container";
import { routes } from "@/config/navigation";
import type { NavigationData, SiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type HeaderProps = {
  site: SiteConfig;
  navigation: NavigationData;
  className?: string;
};

export function Header({ site, navigation, className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={cn(
        "sticky top-0 z-50 border-b bg-background/92 pt-[env(safe-area-inset-top)] backdrop-blur-md transition-colors duration-300",
        scrolled ? "border-border" : "border-transparent",
        className,
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <AppLink
          href={routes.home}
          showExternalIcon={false}
          className="-mx-1 flex min-h-11 items-center rounded-sm px-1 font-heading text-[1.0625rem] text-foreground"
        >
          {site.name}
        </AppLink>

        <NavBar navigation={navigation} />

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className="-mr-2 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-foreground md:hidden"
        >
          Menu
          <Menu className="size-4" aria-hidden="true" />
        </button>
      </Container>

      <MobileNavSheet
        site={site}
        navigation={navigation}
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
    </header>
  );
}
