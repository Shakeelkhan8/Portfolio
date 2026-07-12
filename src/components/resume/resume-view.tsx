import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
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

export function ResumeView({
  site,
  resumeSummary,
  skillGroups,
  experience,
  education,
  accomplishments,
}: ResumeViewProps) {
  return (
    <div className="space-y-10">
      <header className="space-y-2 pb-2">
        <Heading as="h2" size="lg" balance={false}>
          {site.legalName}
        </Heading>
        <Text className="font-medium">{site.title}</Text>
        <Text size="sm" muted>
          {site.email} · {site.phone} · {site.location}
        </Text>
      </header>

      <section className="space-y-3">
        <Heading as="h3" size="sm" balance={false}>
          Summary
        </Heading>
        <Text muted leading="relaxed">
          {resumeSummary}
        </Text>
      </section>

      <section className="space-y-4">
        <Heading as="h3" size="sm" balance={false}>
          Skills
        </Heading>
        <div className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.category}>
              <Text size="sm" className="mb-2 font-medium">
                {group.category}
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      <section className="space-y-6">
        <Heading as="h3" size="sm" balance={false}>
          Experience
        </Heading>
        {experience.map((entry) => (
          <div key={entry.id} className="space-y-2">
            <div>
              <Text className="font-medium">{entry.role}</Text>
              <Text size="sm" muted>
                {entry.company} ·{" "}
                {formatDateRange(entry.startDate, entry.endDate)} ·{" "}
                {entry.location}
              </Text>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {entry.highlights.map((item) => (
                <li key={item.slice(0, 40)} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Separator />

      <section className="space-y-3">
        <Heading as="h3" size="sm" balance={false}>
          Education
        </Heading>
        <Text className="font-medium">{education.degree}</Text>
        <Text size="sm" muted>
          {education.institution} · {education.location} ·{" "}
          {formatDateRange(education.startDate, education.endDate)}
        </Text>
      </section>

      <section className="space-y-3">
        <Heading as="h3" size="sm" balance={false}>
          Accomplishments
        </Heading>
        <ul className="list-disc space-y-2 pl-5">
          {accomplishments.map((item) => (
            <li key={item.text.slice(0, 40)} className="text-sm text-muted-foreground">
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <Heading as="h3" size="sm" balance={false}>
          Languages
        </Heading>
        <Text size="sm" muted>
          {site.languages
            .map((lang) => `${lang.name} (${lang.level})`)
            .join(" · ")}
        </Text>
      </section>
    </div>
  );
}
