import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

const textVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    muted: {
      true: "text-muted-foreground",
      false: "text-foreground",
    },
    leading: {
      tight: "leading-snug",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
  },
  defaultVariants: {
    size: "base",
    muted: false,
    leading: "normal",
  },
});

type TextProps<T extends ElementType = "p"> = {
  as?: T;
} & VariantProps<typeof textVariants> &
  ComponentPropsWithoutRef<T>;

export function Text<T extends ElementType = "p">({
  as,
  size,
  muted,
  leading,
  className,
  ...props
}: TextProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(textVariants({ size, muted, leading, className }))}
      {...props}
    />
  );
}
