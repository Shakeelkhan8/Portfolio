import { Container } from "@/components/layout/container";
import { ContentSection } from "@/components/layout/content-section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ArrowLink } from "@/components/shared/arrow-link";
import { Reveal } from "@/components/motion/reveal";
import { getAboutContent, getSiteConfig, getSkillGroups } from "@/lib/content";
import { routes } from "@/config/navigation";

export default async function AboutPage() {
  const [site, about, skillGroups] = await Promise.all([
    getSiteConfig(),
    getAboutContent(),
    getSkillGroups(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Backend engineer, mostly for systems that handle money"
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="space-y-6 md:col-span-8">
            {about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 30)}
                className={
                  index === 0
                    ? "font-heading text-2xl leading-snug text-pretty text-foreground sm:text-[1.75rem]"
                    : "max-w-[65ch] text-[1.0625rem] leading-relaxed text-pretty text-foreground/85"
                }
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              <ArrowLink href={routes.projects}>See the work</ArrowLink>
              <ArrowLink href={routes.resume}>Read the resume</ArrowLink>
            </div>
          </div>
        </div>
      </Container>

      {site.philosophy.length > 0 ? (
        <ContentSection
          id="principles"
          title="How I work"
          description="A few rules I hold myself to on every system I touch."
        >
          <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {site.philosophy.map((item, index) => (
              <li key={item.title}>
                <Reveal className="border-t border-border pt-5">
                  <p className="label-mono text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-heading text-xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-pretty text-muted-foreground">
                    {item.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </ContentSection>
      ) : null}

      <ContentSection
        id="skills"
        title="Tools I use"
        description="What I reach for day to day. Depth matters more to me than the length of this list."
      >
        <dl className="border-t border-border">
          {skillGroups.map((group) => (
            <Reveal
              key={group.category}
              className="grid gap-2 border-b border-border py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="label-mono pt-1">{group.category}</dt>
              <dd className="leading-relaxed text-foreground">
                {group.skills.join(", ")}
              </dd>
            </Reveal>
          ))}
        </dl>
      </ContentSection>

      {site.languagesVisible !== false && site.languages.length > 0 ? (
        <ContentSection id="languages" title="Languages">
          <dl className="border-t border-border">
            {site.languages.map((language) => (
              <div
                key={`${language.name}-${language.level}`}
                className="grid grid-cols-[10rem_1fr] gap-6 border-b border-border py-4"
              >
                <dt className="font-medium text-foreground">{language.name}</dt>
                <dd className="text-muted-foreground">{language.level}</dd>
              </div>
            ))}
          </dl>
        </ContentSection>
      ) : null}
    </>
  );
}
