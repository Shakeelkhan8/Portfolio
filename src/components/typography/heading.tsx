import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const headingVariants = cva("font-heading tracking-tight text-foreground", {
  variants: {
    size: {
      sm: "text-lg font-medium",
      md: "text-xl font-semibold sm:text-2xl",
      lg: "text-2xl font-semibold sm:text-3xl",
      xl: "text-3xl font-semibold sm:text-4xl",
      "2xl": "text-4xl font-semibold sm:text-5xl",
      hero: "text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl",
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
