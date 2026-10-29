import { cn } from "@/lib/utils";
import type { ArchitectureDiagramData } from "@/types";

type ArchitectureStripProps = {
  diagram: ArchitectureDiagramData;
  className?: string;
};

/**
 * One-line summary of a system's layers for project cards: the first node of
 * each layer, joined by arrows ("Admin Portal → Laravel API → PostgreSQL").
 * The full interactive diagram lives on the case-study page; at card size a
 * boxed diagram was too small to read, so this is a hint, not a figure.
 */
export function ArchitectureStrip({ diagram, className }: ArchitectureStripProps) {
  const layers = Array.from(new Set(diagram.nodes.map((node) => node.layer))).sort(
    (a, b) => a - b,
  );
  const path = layers
    .map((layer) => diagram.nodes.find((node) => node.layer === layer))
    .filter((node) => node !== undefined);

  if (path.length < 2) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap font-mono text-[10px] text-muted-foreground [mask-image:linear-gradient(to_right,#000_82%,transparent)] sm:text-[11px]",
        className,
      )}
    >
      {path.map((node, index) => (
        <span key={node.id} className="flex shrink-0 items-center gap-1.5">
          {index > 0 ? <span className="text-foreground/25">→</span> : null}
          <span className="rounded border border-foreground/10 bg-foreground/[0.03] px-1.5 py-0.5">
            {node.label}
          </span>
        </span>
      ))}
    </div>
  );
}
