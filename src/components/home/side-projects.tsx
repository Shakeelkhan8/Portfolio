import { AppLink } from "@/components/shared/app-link";
import { ArrowLink } from "@/components/shared/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import { SIDE_PROJECT_TAG } from "@/lib/projects";
import type { Project } from "@/types";

type SideProjectsProps = {
  projects: Project[];
};

/** "Side project · 2026 · Open source (MIT)" → "2026 · Open source (MIT)". */
function contextWithoutKind(context: string): string {
  return context.replace(new RegExp(`^${SIDE_PROJECT_TAG}\\s*·\\s*`, "i"), "");
}

export function SideProjects({ projects }: SideProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
      {projects.map((project) => {
        const codeLink = project.links.find((link) =>
          link.href.startsWith("http"),
        );

        return (
          <li key={project.slug}>
            <Reveal className="flex h-full flex-col border-t border-border pt-5">
              <p className="label-mono">
                {contextWithoutKind(project.context)}
              </p>
              <h3 className="mt-3 font-heading text-2xl leading-tight text-foreground">
                <AppLink
                  href={routes.project(project.slug)}
                  showExternalIcon={false}
                  className="transition-colors hover:text-signal"
                >
                  {project.title}
                </AppLink>
              </h3>
              <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
                {project.summary}
              </p>
              <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                {project.stack.slice(0, 4).join(" · ")}
              </p>
              <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-5">
                <ArrowLink href={routes.project(project.slug)}>
                  Write-up
                </ArrowLink>
                {codeLink ? (
                  <ArrowLink href={codeLink.href}>{codeLink.label}</ArrowLink>
                ) : null}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
