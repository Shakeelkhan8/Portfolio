import { ChevronRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";
import { routes } from "@/config/navigation";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8", className)}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li>
          <AppLink
            href={routes.home}
            showExternalIcon={false}
            className="rounded-sm transition-colors hover:text-foreground"
          >
            Home
          </AppLink>
        </li>
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            <ChevronRight
              className="size-3.5 text-muted-foreground/50"
              aria-hidden="true"
            />
            {item.href && index < items.length - 1 ? (
              <AppLink
                href={item.href}
                showExternalIcon={false}
                className="rounded-sm transition-colors hover:text-foreground"
              >
                {item.label}
              </AppLink>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
