import { ArrowUpRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { ArchitectureStrip } from "@/components/architecture/architecture-strip";
import {
  getArchitectureDiagramsBySlugs,
  getFeaturedProjects,
} from "@/lib/content";
import { routes } from "@/config/navigation";
import type { Project } from "@/types";

type ProjectPreviewGridProps = {
  projects?: Project[];
  limit?: number;
  staggered?: boolean;
};

/**
 * Featured case studies on the home page, set as ledger rows: who, status
 * and when in the first column, then title, summary and stack, separated by
 * hairline rules. The grid of identical rounded cards it replaced read as a
 * template. The headline results are already in the hero's ledger directly
 * above, so the rows don't repeat them. The /projects page keeps cards,
 * where each project is an object you open.
 */
export async function ProjectPreviewGrid({
  projects,
  limit,
  staggered = false,
}: ProjectPreviewGridProps) {
  const items = (projects ?? (await getFeaturedProjects())).slice(
    0,
    limit ?? undefined,
  );
  const diagrams = await getArchitectureDiagramsBySlugs(
    items.map((project) => project.slug),
  );

  return (
    <ol className="border-t border-foreground/10">
      {items.map((project, index) => {
        return (
          <li key={project.slug} className="border-b border-foreground/10">
            <Reveal delay={staggered ? index * 0.08 : 0}>
              <article className="group relative">
                <AppLink
                  href={routes.project(project.slug)}
                  showExternalIcon={false}
                  aria-label={`Read case study: ${project.title}`}
                  className="absolute inset-0 z-10 rounded-xl"
                >
                  <span className="sr-only">Read case study</span>
                </AppLink>
                {/* Hover wash: wider than the row so the text never touches its edge. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-1 -inset-x-3 rounded-xl bg-foreground/[0.025] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 sm:-inset-x-5"
                />
                <div className="relative grid gap-5 py-8 sm:py-10 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_auto] md:gap-12">
                  {/* Who, status and when, stacked like a ledger's first column. */}
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 md:flex-col md:gap-1.5">
                    {project.context.split(" · ").map((part) => (
                      <li
                        key={part}
                        className="label-mono first:text-foreground/85 md:tracking-[0.1em]"
                      >
                        {part}
                      </li>
                    ))}
                  </ul>

                  <div className="min-w-0">
                    <h3 className="font-heading text-subheading font-semibold text-foreground transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-[60ch] leading-relaxed text-pretty text-muted-foreground">
                      {project.summary}
                    </p>
                    {diagrams[project.slug] ? (
                      // The real system, layer by layer, from the case study's diagram.
                      <ArchitectureStrip
                        diagram={diagrams[project.slug]!}
                        className="mt-5"
                      />
                    ) : null}
                    {project.stack.length > 0 ? (
                      <p className="mt-3 font-mono text-xs text-foreground/55">
                        {project.stack.slice(0, 5).join("  ·  ")}
                      </p>
                    ) : null}
                  </div>

                  <div className="hidden md:block">
                    <span
                      aria-hidden="true"
                      className="mt-1 flex size-11 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-[transform,border-color,color,background-color] duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-signal/60 group-hover:bg-signal-muted group-hover:text-signal"
                    >
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
