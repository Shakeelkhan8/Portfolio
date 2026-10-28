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

  // Keep mobile previews within the card: at most three layers.
  const displayLayers =
    layers.length <= 3
      ? layers
      : [layers[0]!, layers[Math.floor(layers.length / 2)]!, layers[layers.length - 1]!];

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[5/3] w-full overflow-hidden bg-muted/20 sm:aspect-[16/9]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,color-mix(in_oklch,var(--foreground)_5%,transparent),transparent_65%)]" />
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="relative flex h-full min-w-0 items-center justify-center overflow-hidden px-3 py-4 sm:p-4">
        <div className="flex max-w-full min-w-0 items-center justify-center gap-1 sm:gap-1.5">
          {displayLayers.map((layer, layerIndex) => {
            const nodes = diagram.nodes.filter((node) => node.layer === layer);
            const visible = nodes.slice(0, 2);
            const extra = nodes.length - visible.length;

            return (
              <div
                key={layer}
                className="flex min-w-0 shrink items-center gap-1 sm:gap-1.5"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  {visible.map((node) => (
                    <span
                      key={node.id}
                      className={cn(
                        "line-clamp-2 block max-w-[5.5rem] rounded-md border px-1.5 py-1 text-[9px] font-medium leading-tight text-balance sm:max-w-[7.5rem] sm:px-2 sm:text-[11px]",
                        diagramNodeStyles[node.type],
                      )}
                    >
                      {node.label}
                    </span>
                  ))}
                  {extra > 0 ? (
                    <span className="px-1 text-[9px] text-muted-foreground sm:px-1.5 sm:text-[10px]">
                      +{extra}
                    </span>
                  ) : null}
                </div>
                {layerIndex < displayLayers.length - 1 ? (
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
