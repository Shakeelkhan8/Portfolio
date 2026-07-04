import { AppLink } from "@/components/shared/app-link";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { NavBar } from "@/components/navigation/nav-bar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { SearchTrigger } from "@/components/search/search-trigger";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      role="banner"
      aria-label="Site header"
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70",
        className,
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <AppLink
          href={routes.home}
          className="font-heading text-sm font-semibold tracking-tight text-foreground hover:text-foreground"
        >
          {siteConfig.name}
        </AppLink>

        <div className="flex items-center gap-2">
          <SearchTrigger />
          <NavBar />
          <ThemeToggle />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
