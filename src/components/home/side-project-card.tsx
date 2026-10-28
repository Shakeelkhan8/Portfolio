import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import { SIDE_PROJECT_TAG, displayTags } from "@/lib/projects";
import type { Project } from "@/types";

type SideProjectCardProps = {
  project: Project;
  delay?: number;
};

/** "Side project · 2026 · Open source (MIT)" → "2026 · Open source (MIT)". */
function contextWithoutKind(context: string): string {
  return context.replace(new RegExp(`^${SIDE_PROJECT_TAG}\\s*·\\s*`, "i"), "");
}

/**
 * Compact card for side projects: same surface as the case-study cards, but
 * text-first, with the write-up and (when public) the repository as actions.
 */
export function SideProjectCard({ project, delay = 0 }: SideProjectCardProps) {
  const codeLink = project.links.find((link) => link.href.startsWith("http"));
  const tags = displayTags(project).slice(0, 2);

  return (
    <Reveal className="h-full min-w-0" delay={delay}>
      <article className="site-card group relative flex h-full min-w-0 flex-col rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            {contextWithoutKind(project.context)}
          </p>
          {tags.length > 0 ? (
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-muted/60 text-[0.7rem]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>

        <h3 className="mt-4 font-heading text-lg font-semibold tracking-tight text-foreground">
          <AppLink
            href={routes.project(project.slug)}
            showExternalIcon={false}
            className="rounded-sm after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </AppLink>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
          {project.summary}
        </p>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground/90">
          {project.stack.slice(0, 4).join(" · ")}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-medium">
          <span className="inline-flex items-center gap-1.5 text-foreground">
            Read write-up
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
          {codeLink ? (
            <a
              href={codeLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {codeLink.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}
