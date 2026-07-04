import NextLink from "next/link";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type AppLinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  external?: boolean;
  showExternalIcon?: boolean;
};

export function AppLink({
  external,
  showExternalIcon = true,
  className,
  children,
  href,
  ...props
}: AppLinkProps) {
  const isExternal =
    external ??
    (typeof href === "string" &&
      (href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")));

  if (isExternal) {
    return (
      <a
        href={href as string}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors hover:text-primary",
          className,
        )}
        target={href.toString().startsWith("mailto:") ? undefined : "_blank"}
        rel={
          href.toString().startsWith("mailto:")
            ? undefined
            : "noopener noreferrer"
        }
        {...props}
      >
        {children}
        {showExternalIcon && !href.toString().startsWith("mailto:") ? (
          <ExternalLink className="size-3.5 opacity-60" aria-hidden="true" />
        ) : null}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={cn("transition-colors hover:text-primary", className)}
      {...props}
    >
      {children}
    </NextLink>
  );
}
