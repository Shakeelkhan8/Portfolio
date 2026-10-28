import type { DiagramNodeType } from "@/types";

/**
 * Monochrome node treatments that match the site palette. Layers read by
 * surface weight rather than hue: the API is the brightest node, storage and
 * jobs sit on a filled surface, and third parties are dashed.
 */
export const diagramNodeStyles: Record<DiagramNodeType, string> = {
  frontend: "border-foreground/15 bg-foreground/[0.03] text-foreground/85",
  api: "border-foreground/40 bg-foreground/[0.08] text-foreground",
  service: "border-foreground/20 bg-foreground/[0.04] text-foreground/90",
  database: "border-foreground/15 bg-foreground/[0.07] text-foreground/85",
  cache: "border-foreground/15 bg-foreground/[0.07] text-foreground/85",
  queue: "border-foreground/15 bg-foreground/[0.07] text-foreground/85",
  external:
    "border-dashed border-foreground/20 bg-transparent text-foreground/70",
};
