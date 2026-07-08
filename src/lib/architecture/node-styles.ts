import type { DiagramNodeType } from "@/types";

export const diagramNodeStyles: Record<DiagramNodeType, string> = {
  frontend: "border-blue-500/30 bg-blue-500/5",
  api: "border-primary/30 bg-primary/5",
  service: "border-violet-500/30 bg-violet-500/5",
  database: "border-emerald-500/30 bg-emerald-500/5",
  cache: "border-amber-500/30 bg-amber-500/5",
  queue: "border-orange-500/30 bg-orange-500/5",
  external: "border-border bg-muted/40",
};
