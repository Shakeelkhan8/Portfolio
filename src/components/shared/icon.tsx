import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const;

export function Icon({ icon: IconComponent, size = "md", className, label }: IconProps) {
  return (
    <IconComponent
      className={cn(sizeClasses[size], className)}
      aria-hidden={label ? undefined : true}
      aria-label={label}
    />
  );
}
