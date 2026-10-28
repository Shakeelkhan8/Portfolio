"use client";

import { useMemo, useState } from "react";
import type { ArchitectureDiagramData } from "@/types";
import { cn } from "@/lib/utils";
import {
  diagramNodeStyles,
  diagramNodeTypeLabels,
} from "@/lib/architecture/node-styles";

type ArchitectureDiagramProps = {
  diagram: ArchitectureDiagramData;
};

/**
 * Layered system diagram. Hovering or focusing a node dims everything it
 * isn't directly connected to.
 */
export function ArchitectureDiagram({ diagram }: ArchitectureDiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

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
    <figure className="rounded-lg border border-border bg-surface">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
        <span className="label-mono">{diagram.title}</span>
        <span className="label-mono hidden sm:inline">
          Hover a node to trace it
        </span>
      </figcaption>

      <div className="overflow-x-auto p-4 sm:p-5">
        <div className="flex min-w-max items-center gap-2.5">
          {layers.map((layer, layerIndex) => {
            const nodes = diagram.nodes.filter((node) => node.layer === layer);

            return (
              <div key={layer} className="flex items-center gap-2.5">
                <div className="flex flex-col gap-2.5">
                  {nodes.map((node) => {
                    const dimmed =
                      activeNode !== null && !connectedNodes.has(node.id);

                    return (
                      <button
                        key={node.id}
                        type="button"
                        onMouseEnter={() => setActiveNode(node.id)}
                        onMouseLeave={() => setActiveNode(null)}
                        onFocus={() => setActiveNode(node.id)}
                        onBlur={() => setActiveNode(null)}
                        className={cn(
                          "min-w-[8rem] max-w-[11rem] rounded-md border px-3 py-2 text-left transition-opacity duration-200",
                          diagramNodeStyles[node.type],
                          dimmed && "opacity-35",
                        )}
                      >
                        <span className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                          {diagramNodeTypeLabels[node.type]}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-foreground">
                          {node.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {layerIndex < layers.length - 1 ? (
                  <span className="text-muted-foreground" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
