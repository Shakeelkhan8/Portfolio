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
  const hrefString = href?.toString() ?? "";
  const isMailtoOrTel =
    hrefString.startsWith("mailto:") || hrefString.startsWith("tel:");
  const isExternal =
    external ??
    (typeof href === "string" &&
      (href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")));

  if (isExternal) {
    const showIcon = showExternalIcon && !isMailtoOrTel;

    return (
      <a
        href={hrefString}
        className={cn(
          "inline-flex items-center gap-1.5 transition-colors",
          className,
        )}
        target={isMailtoOrTel ? undefined : "_blank"}
        rel={isMailtoOrTel ? undefined : "noopener noreferrer"}
        {...props}
      >
        {showIcon ? (
          <>
            {children}
            <ExternalLink className="size-3.5 opacity-60" aria-hidden="true" />
          </>
        ) : (
          children
        )}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={cn("transition-colors", className)}
      {...props}
    >
      {children}
    </NextLink>
  );
}
