import { Reveal } from "@/components/motion/reveal";
import type { ArchitectureDiagramData, DiagramNodeType } from "@/types";

type BuildSummaryProps = {
  diagram: ArchitectureDiagramData;
};

/**
 * Groups diagram nodes into the layers a reader scans for. Derived from the
 * project's architecture diagram, so it can only state what the diagram
 * already records; projects without a diagram show nothing.
 */
const GROUPS: Array<{ label: string; types: DiagramNodeType[] }> = [
  { label: "Interface", types: ["frontend"] },
  { label: "API and services", types: ["api", "service"] },
  { label: "Data and jobs", types: ["database", "cache", "queue"] },
  { label: "Integrations", types: ["external"] },
];

export function BuildSummary({ diagram }: BuildSummaryProps) {
  const rows = GROUPS.map((group) => ({
    label: group.label,
    items: diagram.nodes
      .filter((node) => group.types.includes(node.type))
      .map((node) => node.label),
  })).filter((row) => row.items.length > 0);

  if (rows.length === 0) return null;

  return (
    <Reveal>
      <section aria-labelledby="how-its-built" className="space-y-4">
        <h2
          id="how-its-built"
          className="font-mono text-[11px] font-medium tracking-[0.28em] text-muted-foreground uppercase"
        >
          How it&apos;s built
        </h2>
        <dl className="divide-y divide-foreground/[0.06] rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02]">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid gap-1 px-5 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="text-sm font-medium text-foreground">{row.label}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">
                {row.items.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Reveal>
  );
}
