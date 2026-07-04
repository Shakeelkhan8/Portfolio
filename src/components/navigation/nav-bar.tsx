import { NavLink } from "@/components/navigation/nav-link";
import { mainNav, utilityNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

type NavBarProps = {
  className?: string;
};

export function NavBar({ className }: NavBarProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn("hidden items-center gap-6 md:flex lg:gap-8", className)}
    >
      {mainNav.map((item) => (
        <NavLink key={item.href} item={item} />
      ))}
      <span className="hidden h-4 w-px bg-border lg:block" aria-hidden="true" />
      {utilityNav.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          className="hidden text-muted-foreground lg:inline-flex"
        />
      ))}
    </nav>
  );
}
