import { ArrowLink } from "@/components/shared/arrow-link";
import { DecisionRecord } from "@/components/projects/decision-record";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { EngineeringDecision, Project } from "@/types";

const PREFERRED_PROJECT_SLUG = "dispatch-management-saas";

type DecisionHighlightData = {
  project: Project;
  decision: EngineeringDecision;
};

/** The preferred project's first decision, else the first decision anywhere. */
export function pickHighlightedDecision(
  projects: Project[],
): DecisionHighlightData | null {
  const preferred = projects.find(
    (project) => project.slug === PREFERRED_PROJECT_SLUG,
  );
  const ordered = preferred
    ? [preferred, ...projects.filter((p) => p.slug !== preferred.slug)]
    : projects;

  for (const project of ordered) {
    const decision = project.decisions[0];
    if (decision) {
      return { project, decision };
    }
  }

  return null;
}

type DecisionHighlightProps = {
  projects: Project[];
};

export function DecisionHighlight({ projects }: DecisionHighlightProps) {
  const highlight = pickHighlightedDecision(projects);
  if (!highlight) return null;

  const { project, decision } = highlight;

  return (
    <Reveal className="space-y-6">
      <DecisionRecord decision={decision} source={project.title} />
      <ArrowLink href={routes.project(project.slug)}>
        Read the {project.title} case study
      </ArrowLink>
    </Reveal>
  );
}
