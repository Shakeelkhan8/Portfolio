import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { Project } from "@/types";

type WorkRowProps = {
  project: Project;
  /** Heading level: `h3` under a section heading, `h2` on its own page. */
  as?: "h2" | "h3";
};

/**
 * One case study as a row: context, title, summary and stack on the left,
 * the headline metric on the right. The whole row is the link target.
 */
export function WorkRow({ project, as: Heading = "h3" }: WorkRowProps) {
  const metric = project.metrics[0];

  return (
    <Reveal>
      <article className="group relative grid gap-5 border-b border-border py-8 first:pt-0 sm:grid-cols-[1fr_11rem] sm:gap-8">
        <div className="min-w-0">
          <p className="label-mono">{project.context}</p>
          <Heading className="mt-3 font-heading text-[1.625rem] leading-tight text-foreground transition-colors group-hover:text-signal sm:text-[1.875rem]">
            <AppLink
              href={routes.project(project.slug)}
              showExternalIcon={false}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {project.title}
            </AppLink>
          </Heading>
          <p className="mt-3 max-w-xl leading-relaxed text-pretty text-muted-foreground">
            {project.summary}
          </p>
          <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
            {project.stack.slice(0, 5).join(" · ")}
          </p>
        </div>

        {metric ? (
          <div className="sm:pt-7 sm:text-right">
            <p className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
              {metric.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ) : null}

        <p
          aria-hidden="true"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground sm:col-span-2 sm:-mt-3"
        >
          Read the case study
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </p>
      </article>
    </Reveal>
  );
}
