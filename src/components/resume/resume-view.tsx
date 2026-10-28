import type { ReactNode } from "react";
import { formatDateRange } from "@/lib/formatters";
import type { SiteConfig } from "@/types/cms";
import type { Education, ExperienceEntry, SkillGroup } from "@/types";

type ResumeViewProps = {
  site: SiteConfig;
  resumeSummary: string;
  skillGroups: SkillGroup[];
  experience: ExperienceEntry[];
  education: Education;
  accomplishments: Array<{ text: string }>;
};

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-border py-8 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8">
      <h2 className="label-mono pt-1">{title}</h2>
      <div className="mt-4 min-w-0 sm:mt-0">{children}</div>
    </section>
  );
}

/** The web resume, laid out to read well on screen and to print on A4/Letter. */
export function ResumeView({
  site,
  resumeSummary,
  skillGroups,
  experience,
  education,
  accomplishments,
}: ResumeViewProps) {
  return (
    <article>
      <header className="pb-8">
        <p className="font-heading text-3xl text-foreground">{site.name}</p>
        <p className="mt-1 font-medium text-foreground">{site.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {[
            site.email,
            site.phone,
            [site.city, site.location].filter(Boolean).join(", "),
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <ResumeSection title="Summary">
        <p className="max-w-[65ch] leading-relaxed text-pretty text-foreground/85">
          {resumeSummary}
        </p>
      </ResumeSection>

      <ResumeSection title="Experience">
        <ol className="space-y-8">
          {experience.map((entry) => (
            <li key={entry.id}>
              <h3 className="font-medium text-foreground">
                {entry.role}
                <span className="text-muted-foreground">, {entry.company}</span>
              </h3>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                {formatDateRange(entry.startDate, entry.endDate)} ·{" "}
                {entry.location}
              </p>
              <ul className="mt-3 max-w-[65ch] space-y-1.5">
                {entry.highlights.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="relative pl-4 text-sm leading-relaxed text-pretty text-foreground/85 before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-2 before:bg-signal before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </ResumeSection>

      <ResumeSection title="Skills">
        <dl className="space-y-2.5">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:gap-4"
            >
              <dt className="text-sm font-medium text-foreground">
                {group.category}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">
                {group.skills.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      {accomplishments.length > 0 ? (
        <ResumeSection title="Highlights">
          <ul className="max-w-[65ch] space-y-1.5">
            {accomplishments.map((item) => (
              <li
                key={item.text.slice(0, 40)}
                className="relative pl-4 text-sm leading-relaxed text-pretty text-foreground/85 before:absolute before:top-[0.65em] before:left-0 before:h-px before:w-2 before:bg-signal before:content-['']"
              >
                {item.text}
              </li>
            ))}
          </ul>
        </ResumeSection>
      ) : null}

      <ResumeSection title="Education">
        <p className="font-medium text-foreground">{education.degree}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {education.institution}, {education.location} ·{" "}
          {formatDateRange(education.startDate, education.endDate)}
        </p>
      </ResumeSection>

      {site.languages.length > 0 ? (
        <ResumeSection title="Languages">
          <p className="text-sm text-foreground/85">
            {site.languages
              .map((lang) => `${lang.name} (${lang.level})`)
              .join(" · ")}
          </p>
        </ResumeSection>
      ) : null}
    </article>
  );
}
