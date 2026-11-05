"use client";

import { useEffect, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import { SoundToggle } from "@/components/shared/sound-toggle";
import { NavBar } from "@/components/navigation/nav-bar";
import { Container } from "@/components/layout/container";
import { routes } from "@/config/navigation";
import type { NavigationData, PublicSiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type HeaderProps = {
  site: PublicSiteConfig;
  navigation: NavigationData;
  className?: string;
};

export function Header({ site, navigation, className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      aria-label="Site header"
      data-scrolled={scrolled}
      className={cn(
        // CSS entrance (.enter-drop) so the header paints before hydration.
        "enter-drop sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] backdrop-blur-xl supports-backdrop-filter:bg-background/60 dark:border-white/10"
          : "border-b border-transparent bg-transparent",
        className,
      )}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-3">
        <AppLink
          href={routes.home}
          className="group -mx-2 flex min-h-11 min-w-0 items-center rounded-md px-2 py-1 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors active:opacity-70"
        >
          <span
            className="mr-2.5 inline-flex size-2.5 shrink-0 rounded-full bg-foreground transition-transform duration-500 ease-out group-hover:scale-125"
            aria-hidden="true"
          />
          <span className="truncate tracking-wide transition-opacity duration-300 group-hover:opacity-80">
            {site.name}
          </span>
        </AppLink>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <NavBar navigation={navigation} />
          <div
            className="mx-1 hidden h-5 w-px bg-border/80 md:block"
            aria-hidden="true"
          />
          <SoundToggle />
        </div>
      </Container>
    </header>
  );
}
