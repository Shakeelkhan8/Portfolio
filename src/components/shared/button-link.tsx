import { AppLink } from "@/components/shared/app-link";
import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

type ButtonLinkProps = Omit<
  ComponentProps<typeof Button>,
  "render" | "nativeButton"
> & {
  href: ComponentProps<typeof AppLink>["href"];
  external?: boolean;
  showExternalIcon?: boolean;
};

export function ButtonLink({
  href,
  external,
  showExternalIcon = false,
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
    />
  );
}
