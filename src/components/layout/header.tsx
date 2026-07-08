"use client";

import { useEffect, useState } from "react";
import { AppLink } from "@/components/shared/app-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavBar } from "@/components/navigation/nav-bar";
import { MobileNav } from "@/components/navigation/mobile-nav";
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
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-border/70 bg-background/80 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/65"
          : "border-transparent bg-background/60 backdrop-blur-md supports-backdrop-filter:bg-background/40",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <AppLink
          href={routes.home}
          className="group -mx-2 flex min-w-0 items-center rounded-md px-2 py-1 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-foreground"
        >
          <span className="mr-2 inline-block size-2 shrink-0 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" aria-hidden="true" />
          <span className="truncate">{site.name}</span>
        </AppLink>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NavBar navigation={navigation} />
          <div
            className="mx-0.5 hidden h-5 w-px bg-border md:block"
            aria-hidden="true"
          />
          <ThemeToggle />
          <MobileNav site={site} navigation={navigation} />
        </div>
      </Container>
    </header>
  );
}
