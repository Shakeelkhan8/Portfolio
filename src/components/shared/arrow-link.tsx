import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { cn } from "@/lib/utils";

type ArrowLinkProps = Omit<ComponentProps<typeof AppLink>, "children"> & {
  children: ReactNode;
};

/** Inline text link with a trailing arrow: ↗ for external links, → otherwise. */
export function ArrowLink({
  href,
  children,
  className,
  external,
  ...props
}: ArrowLinkProps) {
  const isExternal =
    external ?? (typeof href === "string" && href.startsWith("http"));
  const Icon = isExternal ? ArrowUpRight : ArrowRight;

  return (
    <AppLink
      href={href}
      external={external}
      showExternalIcon={false}
      className={cn(
        "group/arrow inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-signal",
        className,
      )}
      {...props}
    >
      {children}
      <Icon
        aria-hidden="true"
        className={cn(
          "size-4 transition-transform duration-200",
          isExternal
            ? "group-hover/arrow:-translate-y-0.5 group-hover/arrow:translate-x-0.5"
            : "group-hover/arrow:translate-x-0.5",
        )}
      />
      {isExternal ? (
        <span className="sr-only">(opens in a new tab)</span>
      ) : null}
    </AppLink>
  );
}
