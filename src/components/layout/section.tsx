import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: "default" | "sm" | "none";
};

const spacingClasses = {
  default: "section-spacing",
  sm: "section-spacing-sm",
  none: "",
} as const;

export function Section({
  spacing = "default",
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "max-w-full overflow-x-clip",
        spacingClasses[spacing],
        className,
      )}
      {...props}
    />
  );
}
