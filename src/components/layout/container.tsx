import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: "content" | "prose" | "wide";
};

const sizeClasses = {
  content: "container-content",
  prose: "container-prose px-6",
  wide: "container-wide",
} as const;

export function Container({
  size = "content",
  className,
  ...props
}: ContainerProps) {
  return <div className={cn(sizeClasses[size], className)} {...props} />;
}
