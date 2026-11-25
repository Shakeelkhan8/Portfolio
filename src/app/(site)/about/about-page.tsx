import { DecisionHighlight } from "@/components/about/decision-highlight";
import { PrinciplesGrid } from "@/components/home/principles-grid";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Reveal } from "@/components/motion/reveal";
import { Text } from "@/components/typography/text";
import { Badge } from "@/components/ui/badge";
import {
  getAboutContent,
  getFeaturedTestimonials,
  getSectionHeader,
  getSiteConfig,
  getSkillGroups,
} from "@/lib/content";

export default async function AboutPage() {
  // "How I work" and the testimonials moved here from the home page
  // (2026-11-22); their labels are still the home section headers in Admin.
  const [site, about, skillGroups, principlesHeader, testimonialsHeader, testimonials] =
    await Promise.all([
      getSiteConfig(),
      getAboutContent(),
      getSkillGroups(),
      getSectionHeader("home", "philosophy"),
      getSectionHeader("home", "testimonials"),
      getFeaturedTestimonials(),
    ]);

  return (
    <>
      <PageHeader
        title="About"
        heading="I build software end to end, and stay with it after launch."
        description="SaaS platforms, web applications, APIs and integrations, in PHP/Laravel, TypeScript/Node.js and React."
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Section spacing="none" className="pb-10 sm:pb-12">
        <Container className="space-y-5">
          {about.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 30)} delay={index * 0.05}>
              <Text
                leading="relaxed"
                className="max-w-[68ch] text-lead text-pretty text-foreground/80"
              >
                {paragraph}
              </Text>
            </Reveal>
          ))}
        </Container>
      </Section>

      <DecisionHighlight />

      {site.philosophy.length > 0 ? (
        <Section spacing="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
          <Container>
            <SectionHeader
              title={principlesHeader?.title ?? "How I work"}
              description={
                principlesHeader?.description ??
                "Rules I hold myself to on every system I build."
              }
            />
            <PrinciplesGrid principles={site.philosophy} />
          </Container>
        </Section>
      ) : null}

      <Section spacing="none" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
        <Container>
          <SectionHeader
            title="Toolkit"
            description="What I reach for, grouped by the job it does."
          />
          {/* Ruled rows, like a ledger: the job on the left, the tools on the right. */}
          {/*
            One reveal for the whole list: a <dl> may only contain <dt>/<dd>
            groups wrapped in a single <div>, so each row must be a direct
            child (a per-row Reveal added a second wrapper and failed axe).
          */}
          <Reveal>
            <dl className="border-t border-foreground/10">
              {skillGroups.map((group) => (
                <div
                  key={group.category}
                  className="grid gap-3 border-b border-foreground/10 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-8 sm:py-6"
                >
                  <dt className="font-heading text-subheading font-semibold text-foreground">
                    {group.category}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <li key={skill}>
                          <Badge
                            variant="secondary"
                            className="border border-foreground/8 bg-foreground/[0.03] px-2.5 py-1 text-[0.8125rem] font-medium text-foreground/85"
                          >
                            {skill}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {testimonials.length > 0 ? (
        <Section spacing="none" className="pb-16 pt-2 sm:pb-20 sm:pt-4">
          <Container>
            {/*
              The statement follows the count, not the CMS: "Trusted by people
              I've worked with" over a single quote would overstate it.
            */}
            <SectionHeader
              title={testimonialsHeader?.title ?? "Testimonials"}
              description={
                testimonials.length >= 2
                  ? "Trusted by people I've worked with."
                  : "In a client's words."
              }
            />
            <TestimonialsSection testimonials={testimonials} />
          </Container>
        </Section>
      ) : null}

      {site.languagesVisible !== false && site.languages.length > 0 ? (
        <Section spacing="none" className="pb-16 pt-2 sm:pb-20 sm:pt-4">
          <Container>
            <SectionHeader title="Languages" />
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-3">
              {site.languages.map((language) => (
                <li
                  key={`${language.name}-${language.level}`}
                  className="border-t border-foreground/10 pt-4"
                >
                  <p className="font-heading text-subheading font-semibold text-foreground">
                    {language.name}
                  </p>
                  <p className="label-mono mt-2">{language.level}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
