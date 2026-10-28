import type { DiagramNodeType } from "@/types";

/** Short labels printed above each node so the diagram reads without colour. */
export const diagramNodeTypeLabels: Record<DiagramNodeType, string> = {
  frontend: "Client",
  api: "API",
  service: "Service",
  database: "Database",
  cache: "Cache",
  queue: "Jobs",
  external: "External",
};

/** The API layer is the system's centre of gravity, so it alone carries the accent. */
export const diagramNodeStyles: Record<DiagramNodeType, string> = {
  frontend: "border-border bg-background",
  api: "border-signal/60 bg-background",
  service: "border-border bg-background",
  database: "border-border bg-muted",
  cache: "border-border bg-muted",
  queue: "border-border bg-muted",
  external: "border-dashed border-border bg-transparent",
};
