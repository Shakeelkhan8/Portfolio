import { NavLink } from "@/components/navigation/nav-link";
import type { NavigationData } from "@/types/cms";
import { cn } from "@/lib/utils";

type NavBarProps = {
  navigation: NavigationData;
  className?: string;
};

export function NavBar({ navigation, className }: NavBarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn("hidden items-center gap-6 md:flex lg:gap-8", className)}
    >
      {navigation.mainNav.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
      <span className="hidden h-4 w-px bg-border lg:block" aria-hidden="true" />
      {navigation.utilityNav.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="hidden text-muted-foreground lg:inline-flex"
        />
      ))}
    </nav>
  );
}
