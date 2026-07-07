import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const headingVariants = cva("font-heading tracking-tight text-foreground", {
  variants: {
    size: {
      sm: "text-lg font-medium leading-snug",
      md: "text-xl font-semibold leading-snug sm:text-2xl",
      lg: "text-2xl font-semibold leading-tight sm:text-3xl",
      xl: "text-3xl font-semibold leading-tight -tracking-[0.01em] sm:text-4xl",
      "2xl": "text-[2rem] font-semibold leading-[1.1] -tracking-[0.015em] sm:text-[2.75rem]",
      hero: "text-[2.5rem] font-semibold leading-[1.05] -tracking-[0.025em] sm:text-6xl lg:text-[4.25rem]",
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
