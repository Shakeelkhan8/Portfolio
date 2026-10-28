import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type RevealProps = ComponentPropsWithoutRef<"div">;

/**
 * Fades content in as it scrolls into view, using a CSS view timeline
 * (`.reveal` in globals.css). Content renders visible on the server and
 * stays visible in browsers without view timelines or with reduced motion,
 * so a reveal can never hide content from readers or crawlers.
 */
export function Reveal({ className, ...props }: RevealProps) {
  return <div className={cn("reveal", className)} {...props} />;
}
