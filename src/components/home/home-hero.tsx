import { ArrowRight } from "lucide-react";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ButtonLink } from "@/components/shared/button-link";
import { Container } from "@/components/layout/container";
import { routes } from "@/config/navigation";
import type { CtaSection, SiteConfig } from "@/types/cms";
import type { ExperienceEntry } from "@/types";

type HomeHeroProps = {
  site: SiteConfig;
  /** CMS-managed headline, intro and CTAs (`cta_sections.home_hero`). */
  cta?: CtaSection | null;
  currentRole?: ExperienceEntry;
};

/** "GMT+5" for Asia/Karachi. Resolved at render time so DST zones stay right. */
function formatUtcOffset(timeZone: string): string | null {
  try {
    const part = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName");
    return part?.value.replace("GMT", "UTC") ?? null;
  } catch {
    return null;
  }
}

export function HomeHero({ site, cta, currentRole }: HomeHeroProps) {
  // Older CMS rows set the hero title to the site name; fall back to the job
  // title so the headline never just repeats the name above it.
  const ctaTitle = cta?.title?.trim();
  const headline = ctaTitle && ctaTitle !== site.name ? ctaTitle : site.title;
  const intro = cta?.description?.trim() || site.description;

  const primaryLabel = cta?.primaryLabel?.trim() || null;
  const primaryHref = cta?.primaryHref?.trim() || routes.projects;
  const secondaryLabel = cta?.secondaryLabel?.trim() || null;
  const secondaryHref = cta?.secondaryHref?.trim() || routes.contact;

  const offset = formatUtcOffset(site.timezone);
  const facts = [
    currentRole
      ? { term: "Now", detail: `${currentRole.role}, ${currentRole.company}` }
      : null,
    site.yearsOfExperience
      ? {
          term: "Experience",
          detail: `${site.yearsOfExperience}+ years full-time`,
        }
      : null,
    site.expertise.length > 0
      ? { term: "Focus", detail: site.expertise.slice(0, 3).join(", ") }
      : null,
    {
      term: "Based in",
      detail:
        [site.city, site.location].filter(Boolean).join(", ") +
        (offset ? ` (${offset}), working remotely` : ", working remotely"),
    },
  ].filter((fact): fact is { term: string; detail: string } => fact !== null);

  return (
    <section aria-label="Introduction">
      <Container className="grid gap-12 pt-14 pb-16 sm:pt-20 sm:pb-24 md:grid-cols-12 md:gap-12 md:pt-28 md:pb-28">
        <div className="md:col-span-8">
          <AvailabilityBadge site={site} />

          <h1 className="mt-8">
            <span className="block text-base font-medium text-foreground">
              {site.name}
              <span className="text-muted-foreground"> · </span>
              <span className="text-muted-foreground">{site.title}</span>
            </span>
            <span className="mt-4 block font-heading text-[2.625rem] leading-[1.04] text-foreground sm:text-6xl lg:text-[4.5rem]">
              {headline}
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
            {intro}
          </p>

          {primaryLabel || secondaryLabel ? (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {primaryLabel ? (
                <ButtonLink
                  href={primaryHref}
                  size="lg"
                  className="min-h-12 px-6"
                >
                  {primaryLabel}
                  <ArrowRight
                    className="size-4"
                    data-icon="inline-end"
                    aria-hidden="true"
                  />
                </ButtonLink>
              ) : null}
              {secondaryLabel ? (
                <ButtonLink
                  href={secondaryHref}
                  variant="outline"
                  size="lg"
                  className="min-h-12 bg-transparent px-6"
                >
                  {secondaryLabel}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside aria-label="At a glance" className="md:col-span-4 md:pt-24">
          <dl className="divide-y divide-border border-y border-border">
            {facts.map((fact) => (
              <div
                key={fact.term}
                className="grid grid-cols-[6.5rem_1fr] gap-3 py-3.5"
              >
                <dt className="label-mono pt-0.5">{fact.term}</dt>
                <dd className="text-sm leading-relaxed text-foreground">
                  {fact.detail}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </Container>
    </section>
  );
}
