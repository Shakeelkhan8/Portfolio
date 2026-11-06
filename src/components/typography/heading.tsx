import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * Heading sizes map onto the site type scale (`--text-*` tokens in
 * globals.css, documented in docs/DESIGN.md). Each token carries its own
 * line height and tracking, so variants don't set them.
 */
const headingVariants = cva("font-heading text-foreground", {
  variants: {
    size: {
      /** Small item titles inside lists. */
      sm: "text-lg leading-snug font-medium tracking-tight",
      /** Card and item titles. */
      md: "text-subheading font-semibold",
      /** Section headings inside a page. */
      lg: "font-stretch-semi-expanded text-heading font-semibold",
      /** Page titles: one per page. */
      xl: "font-stretch-semi-expanded text-title font-semibold",
      /** Section statements on the home page. */
      "2xl": "font-stretch-semi-expanded text-heading font-semibold",
      /** Home hero headline. */
      hero: "font-stretch-semi-expanded text-display font-semibold",
    },
    balance: {
      true: "text-balance",
      false: "",
    },
  },
  defaultVariants: {
    size: "lg",
    balance: true,
  },
});

type HeadingProps<T extends ElementType = "h2"> = {
  as?: T;
} & VariantProps<typeof headingVariants> &
  ComponentPropsWithoutRef<T>;

export function Heading<T extends ElementType = "h2">({
  as,
  size,
  balance,
  className,
  ...props
}: HeadingProps<T>) {
  const Component = as ?? "h2";

  return (
    <Component
      className={cn(headingVariants({ size, balance, className }))}
      {...props}
    />
  );
}
