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
        <AppLink
          href={href}
          external={external}
          showExternalIcon={showExternalIcon}
        />
      }
      {...props}
    >
      {children}
    </Button>
  );
}
