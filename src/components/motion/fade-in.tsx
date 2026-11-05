import type { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type FadeInProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** `up` rises 22px (desktop only; phones fade); `none` fades in place. */
  direction?: "up" | "none";
};

/**
 * Entrance fade for page headers and case-study sections.
 *
 * Pure CSS (`.enter-rise` / `.enter-fade` in globals.css), so it starts on
 * first paint instead of after hydration and needs no client JavaScript.
 * Reduced motion turns the animation off in CSS.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  direction = "up",
  className,
  style,
  ...props
}: FadeInProps) {
  return (
    <div
      className={cn(direction === "up" ? "enter-rise" : "enter-fade", className)}
      style={
        {
          "--enter-delay": `${delay}s`,
          "--enter-duration": `${duration}s`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
