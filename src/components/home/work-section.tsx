import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ArchitectureDiagram } from "@/components/architecture/architecture-diagram";
import { ArchitectureStrip } from "@/components/architecture/architecture-strip";
import { Reveal } from "@/components/motion/reveal";
import { AppLink } from "@/components/shared/app-link";
import { routes } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { ArchitectureDiagramData, Project } from "@/types";

/**
 * Real product screenshots for projects that have them (from the project's
 * own repo). Projects without one show their system map instead; nothing
 * here is a mock-up.
 */
const SCREENSHOTS: Record<string, Array<{ src: string; alt: string }>> = {
  "ai-mentor-health": [
    {
      src: "/images/work/ai-mentor-dashboard.png",
      alt: "AI Mentor Health dashboard: today's habits, completion rate and streaks for a demo user",
    },
    {
      src: "/images/work/ai-mentor-coach.png",
      alt: "AI Mentor Health coach: a chat that remembers the user's goals",
    },
  ],
};

/** The status part of a project's context ("Elityx · In production · …"). */
const STATUS = /production|paused|not deployed|open source/i;

function contextParts(project: Project) {
  const parts = project.context.split(" · ").filter(Boolean);
  return {
    who: parts[0] ?? "",
    status: parts.find((part) => STATUS.test(part)) ?? null,
    rest: parts.slice(1).filter((part) => !STATUS.test(part)),
  };
}

/** A public code link, if the project has one (private repos have none). */
function codeLink(project: Project) {
  return project.links.find((link) => link.href.startsWith("https://github.com/")) ?? null;
}

function StatusBadge({ status }: { status: string }) {
  const live = /production|open source/i.test(status);
  return (
    <span className="label-mono inline-flex items-center gap-2 rounded-full border border-foreground/15 px-2.5 py-1 text-foreground/80">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", live ? "bg-success" : "bg-foreground/40")}
      />
      {status}
    </span>
  );
}

function StackChips({ stack, limit }: { stack: string[]; limit: number }) {
  return (
    <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
      {stack.slice(0, limit).map((item) => (
        <li
          key={item}
          className="rounded-full border border-foreground/10 px-2.5 py-0.5 text-xs text-foreground/70"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Screenshots({ images }: { images: Array<{ src: string; alt: string }> }) {
  const [main, second] = images;
  return (
    <div className="relative pb-10 sm:pb-14">
      <figure className="overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.03] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]">
        <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-foreground/10 px-3 py-2">
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
          <span className="size-2 rounded-full bg-foreground/15" />
        </div>
        <Image
          src={main.src}
          alt={main.alt}
          width={2560}
          height={1600}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="h-auto w-full"
        />
      </figure>
      {second ? (
        <figure className="absolute right-0 bottom-0 w-[52%] sm:right-[-4%] overflow-hidden rounded-lg border border-foreground/15 bg-background shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)]">
          <Image
            src={second.src}
            alt={second.alt}
            width={2560}
            height={1600}
            sizes="(min-width: 1024px) 300px, 52vw"
            className="h-auto w-full"
          />
        </figure>
      ) : null}
    </div>
  );
}

function FeaturedRow({
  project,
  diagram,
  index,
}: {
  project: Project;
  diagram?: ArchitectureDiagramData;
  index: number;
}) {
  const { who, status, rest } = contextParts(project);
  const code = codeLink(project);
  const metric = project.metrics[0];
  const hardest = project.challenges[0];
  const screenshots = SCREENSHOTS[project.slug];
  const hasVisual = Boolean(screenshots || diagram);

  return (
    <li>
      <Reveal>
        <article
          aria-labelledby={`work-${project.slug}`}
          className={cn(
            "grid items-center gap-10 lg:gap-16",
            hasVisual && "lg:grid-cols-2",
          )}
        >
          <div className={cn("min-w-0", hasVisual && index % 2 === 1 && "lg:order-2")}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {status ? <StatusBadge status={status} /> : null}
              <span className="label-mono text-foreground/60">
                {[who, ...rest].join(" · ")}
              </span>
            </div>
            <h3
              id={`work-${project.slug}`}
              className="mt-5 font-heading font-stretch-semi-expanded text-heading font-semibold text-balance text-foreground"
            >
              {project.title}
            </h3>
            <p className="mt-4 max-w-[60ch] leading-relaxed text-pretty text-foreground/80">
              {project.summary}
            </p>
            {hardest ? (
              <p className="mt-5 max-w-[60ch] border-l-2 border-signal/60 pl-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                <span className="label-mono mb-1 block text-foreground/60">The hard part</span>
                {hardest}
              </p>
            ) : null}
            {metric ? (
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-heading text-subheading font-semibold text-foreground">
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </p>
            ) : null}
            <div className="mt-6">
              <StackChips stack={project.stack} limit={7} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AppLink
                href={routes.project(project.slug)}
                showExternalIcon={false}
                className="group inline-flex min-h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Read the case study
                <span className="sr-only">: {project.title}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </AppLink>
              {code ? (
                <a
                  href={code.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-foreground/20 px-5 text-sm font-medium text-foreground transition-colors hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View the code
                  <span className="sr-only">for {project.title} (opens in a new tab)</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ) : null}
            </div>
          </div>

          {screenshots ? (
            <div className={cn("min-w-0", index % 2 === 1 && "lg:order-1")}>
              <Screenshots images={screenshots} />
            </div>
          ) : diagram ? (
            <div
              className={cn(
                "min-w-0 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 sm:p-6",
                index % 2 === 1 && "lg:order-1",
              )}
            >
              {/* The diagram carries its own title ("Keystone: architecture"). */}
              <ArchitectureDiagram diagram={diagram} />
            </div>
          ) : null}
        </article>
      </Reveal>
    </li>
  );
}

function WorkCard({
  project,
  diagram,
  index,
}: {
  project: Project;
  diagram?: ArchitectureDiagramData;
  index: number;
}) {
  const { who, status, rest } = contextParts(project);
  const metric = project.metrics[0];

  return (
    <li>
      <Reveal delay={(index % 3) * 0.06} className="h-full">
        <article className="group relative flex h-full min-w-0 flex-col rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-colors duration-300 hover:border-foreground/25">
          <AppLink
            href={routes.project(project.slug)}
            showExternalIcon={false}
            aria-label={`Read case study: ${project.title}`}
            className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="sr-only">Read case study</span>
          </AppLink>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {status ? <StatusBadge status={status} /> : null}
            <span className="label-mono text-foreground/60">{[who, ...rest].join(" · ")}</span>
          </div>
          <h3 className="mt-4 font-heading text-subheading font-semibold text-foreground">
            {project.title}
          </h3>
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-pretty text-muted-foreground">
            {project.summary}
          </p>
          {metric ? (
            <p className="mt-4 text-sm">
              <span className="font-semibold text-foreground">{metric.value}</span>{" "}
              <span className="text-muted-foreground">{metric.label}</span>
            </p>
          ) : null}
          <div className="mt-auto space-y-4 pt-6">
            {diagram ? <ArchitectureStrip diagram={diagram} /> : null}
            <StackChips stack={project.stack} limit={4} />
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Case study
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

type WorkSectionProps = {
  projects: Project[];
  diagrams: Record<string, ArchitectureDiagramData>;
};

/**
 * The home page's Work section. Featured projects (Admin → Projects →
 * Featured; Dispatch, Keystone and AI Mentor Health since 2026-11-22) are
 * large rows that say what it is, its status, the hard part, a number that
 * can be backed, the stack and the proof: a real screenshot or the system
 * map, the case study, and the code when the repo is public. The rest are
 * cards under "More work". Statuses come from each project's context line,
 * so a paused or undeployed project says so.
 */
export function WorkSection({ projects, diagrams }: WorkSectionProps) {
  const featured = projects.filter((project) => project.featured);
  const lead = featured.length > 0 ? featured : projects.slice(0, 3);
  const more = projects.filter((project) => !lead.includes(project));

  return (
    <div>
      <ol className="min-w-0 space-y-24 sm:space-y-28">
        {lead.map((project, index) => (
          <FeaturedRow
            key={project.slug}
            project={project}
            diagram={diagrams[project.slug]}
            index={index}
          />
        ))}
      </ol>

      {more.length > 0 ? (
        <div className="mt-24 sm:mt-28">
          <div className="mb-8 flex items-end justify-between gap-6">
            <p className="label-mono flex items-center gap-2.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
              More work
            </p>
            <AppLink
              href={routes.projects}
              showExternalIcon={false}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              All case studies
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </AppLink>
          </div>
          {/*
            grid-cols-1 (minmax(0, 1fr)) matters on phones: an implicit
            column grows to the card's longest unwrapped line (the
            architecture strip), and the cards overflowed the screen.
          */}
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {more.map((project, index) => (
              <WorkCard
                key={project.slug}
                project={project}
                diagram={diagrams[project.slug]}
                index={index}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
