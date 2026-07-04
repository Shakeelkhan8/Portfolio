"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ArchitectureDiagramData, DiagramNodeType } from "@/types";
import { cn } from "@/lib/utils";
import { Text } from "@/components/typography/text";

const nodeStyles: Record<DiagramNodeType, string> = {
  frontend: "border-blue-500/30 bg-blue-500/5",
  api: "border-primary/30 bg-primary/5",
  service: "border-violet-500/30 bg-violet-500/5",
  database: "border-emerald-500/30 bg-emerald-500/5",
  cache: "border-amber-500/30 bg-amber-500/5",
  queue: "border-orange-500/30 bg-orange-500/5",
  external: "border-border bg-muted/40",
};

type ArchitectureDiagramProps = {
  diagram: ArchitectureDiagramData;
};

export function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const layers = useMemo(() => {
    const layerSet = new Set(diagram.nodes.map((node) => node.layer));
    return Array.from(layerSet).sort((a, b) => a - b);
  }, [diagram.nodes]);

  const connectedNodes = useMemo(() => {
    if (!activeNode) return new Set<string>();

    const connected = new Set<string>([activeNode]);
    diagram.edges.forEach((edge) => {
      if (edge.from === activeNode) connected.add(edge.to);
      if (edge.to === activeNode) connected.add(edge.from);
    });
    return connected;
  }, [activeNode, diagram.edges]);

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-4 md:p-6">
      <Text size="sm" className="mb-6 font-medium">
        {diagram.title}
      </Text>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max items-stretch gap-3 md:gap-4">
          {layers.map((layer, layerIndex) => {
            const nodes = diagram.nodes.filter((node) => node.layer === layer);

            return (
              <div key={layer} className="flex items-center gap-3 md:gap-4">
                <div className="flex flex-col gap-3">
                  {nodes.map((node) => {
                    const isActive =
                      !activeNode || connectedNodes.has(node.id);
                    const isFocused = activeNode === node.id;

                    return (
                      <motion.button
                        key={node.id}
                        type="button"
                        onMouseEnter={() => setActiveNode(node.id)}
                        onMouseLeave={() => setActiveNode(null)}
                        onFocus={() => setActiveNode(node.id)}
                        onBlur={() => setActiveNode(null)}
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : {
                                opacity: isActive ? 1 : 0.45,
                                scale: isFocused ? 1.02 : 1,
                              }
                        }
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "min-w-[9rem] rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-shadow",
                          nodeStyles[node.type],
                          isFocused && "shadow-md ring-2 ring-ring/40",
                        )}
                      >
                        {node.label}
                      </motion.button>
                    );
                  })}
                </div>

                {layerIndex < layers.length - 1 ? (
                  <div
                    className="hidden text-muted-foreground md:block"
                    aria-hidden="true"
                  >
                    →
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <Text size="xs" muted className="mt-4">
        Hover a component to highlight connected services.
      </Text>
    </div>
  );
}
