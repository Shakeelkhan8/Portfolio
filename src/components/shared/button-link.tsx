import { ExternalLink } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Button } from "@/components/ui/button";
import type { ComponentProps, ReactNode } from "react";

type ButtonLinkProps = Omit<
  ComponentProps<typeof Button>,
  "render" | "nativeButton" | "children"
> & {
  href: ComponentProps<typeof AppLink>["href"];
  external?: boolean;
  showExternalIcon?: boolean;
  children: ReactNode;
};

/**
 * A link styled as a button. The external icon is rendered here, inside the
 * button's own children: when AppLink added it, the Base UI `render` merge
 * dropped the label and left an icon-only button.
 */
export function ButtonLink({
  href,
  external,
  showExternalIcon = false,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Button
      nativeButton={false}
      render={
        <AppLink href={href} external={external} showExternalIcon={false} />
      }
      {...props}
    >
      {children}
      {showExternalIcon ? (
        <ExternalLink
          aria-hidden="true"
          data-icon="inline-end"
          className="size-3.5 opacity-60"
        />
      ) : null}
    </Button>
  );
}
