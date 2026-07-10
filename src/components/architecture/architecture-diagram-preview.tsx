import { diagramNodeStyles } from "@/lib/architecture/node-styles";
import { cn } from "@/lib/utils";
import type { ArchitectureDiagramData } from "@/types";

type ArchitectureDiagramPreviewProps = {
  diagram: ArchitectureDiagramData;
};

export function ArchitectureDiagramPreview({
  diagram,
}: ArchitectureDiagramPreviewProps) {
  const layers = Array.from(
    new Set(diagram.nodes.map((node) => node.layer)),
  ).sort((a, b) => a - b);

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[16/9] w-full overflow-hidden border-b border-border/60 bg-muted/20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklch,var(--foreground)_5%,transparent),transparent_65%)]" />
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="relative flex h-full items-center justify-center p-3 sm:p-4">
        <div className="flex min-w-0 max-w-full items-center gap-1 sm:gap-1.5">
          {layers.map((layer, layerIndex) => {
            const nodes = diagram.nodes.filter((node) => node.layer === layer);
            const visible = nodes.slice(0, 2);
            const extra = nodes.length - visible.length;

            return (
              <div
                key={layer}
                className="flex min-w-0 items-center gap-1 sm:gap-1.5"
              >
                <div className="flex flex-col gap-1">
                  {visible.map((node) => (
                    <span
                      key={node.id}
                      className={cn(
                        "block max-w-[5.5rem] truncate rounded-md border px-1.5 py-1 text-[10px] font-medium leading-tight sm:max-w-[6.5rem] sm:px-2 sm:text-[11px]",
                        diagramNodeStyles[node.type],
                      )}
                    >
                      {node.label}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="px-1.5 text-[10px] text-muted-foreground">
                      +{extra} more
                    </span>
                  ) : null}
                </div>
                {layerIndex < layers.length - 1 ? (
                  <span
                    className="shrink-0 text-[10px] text-muted-foreground/70 sm:text-xs"
                    aria-hidden="true"
                  >
                    →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
