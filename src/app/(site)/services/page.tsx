import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { PageHeader } from "@/components/shared/page-header";
import { ButtonLink } from "@/components/shared/button-link";
import { AppLink } from "@/components/shared/app-link";
import { JsonLd } from "@/components/seo/json-ld";
import { EngagementPaths } from "@/components/services/engagement-paths";
import { FaqList } from "@/components/services/faq-list";
import { PackageGrid } from "@/components/services/package-grid";
import { ServiceList } from "@/components/services/service-list";
import {
  engagementPaths,
  faqs,
  packages,
  pricingNote,
  services,
} from "@/content/service-catalog";
import { routes } from "@/config/navigation";
import { getSiteConfig } from "@/lib/content";
import { buildPageMetadata, getMetadataContext } from "@/lib/metadata";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getServiceCatalogSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildPageMetadata(ctx, {
    title: "Services and pricing",
    description:
      "Laravel and PHP fixes from $60, API and payment integrations from $150, OpenAI and Claude features from $200, upgrades from $120, and care plans from $249 a month.",
    path: routes.services,
  });
}

/**
 * What can be hired and at what starting price (content in
 * src/content/service-catalog.ts). Ordered by how a visitor decides: how big
 * is my job, what exactly do you do, is there a fixed package, and the
 * questions that usually come before saying yes.
 */
export default async function ServicesPage() {
  const site = await getSiteConfig();
  const pageUrl = `${site.url}${routes.services}`;

  return (
    <>
      <JsonLd
        data={[
          getBreadcrumbSchema([
            { name: "Home", url: site.url },
            { name: "Services", url: pageUrl },
          ]),
          getServiceCatalogSchema(
            site,
            [...services, ...packages],
            pageUrl,
          ),
          getFaqSchema(faqs),
        ]}
      />

      <PageHeader
        title="Services"
        heading="Backend work you can hire me for, priced up front."
        description="Fixes, integrations, AI features, upgrades and ongoing care for Laravel and PHP applications. Every job is scoped and priced in writing before I start."
      >
        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <ButtonLink href={`${routes.contact}#contact-form`} size="lg" className="group">
            Discuss your project
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              data-icon="inline-end"
            />
          </ButtonLink>
          {site.links.upwork ? (
            <AppLink
              href={site.links.upwork}
              showExternalIcon
              className="link-draw text-[0.9375rem] font-medium text-foreground"
            >
              The same packages on Upwork
            </AppLink>
          ) : null}
        </div>
      </PageHeader>

      <Section spacing="sm" className="pt-4">
        <Container>
          <SectionHeader
            title="Ways to work together"
            description="Start small, build something, or keep it running."
          />
          <EngagementPaths paths={engagementPaths} />
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <SectionHeader
            title="Services"
            description="What each kind of job includes, and who it suits."
          />
          <ServiceList services={services} />
          <p className="mt-8 max-w-[68ch] text-sm leading-relaxed text-pretty text-muted-foreground">
            {pricingNote}
          </p>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <SectionHeader
            title="Packages"
            description="Three fixed-scope ways to start, with the limits written down."
          />
          <PackageGrid packages={packages} />
        </Container>
      </Section>

      <Section spacing="sm">
        <Container>
          <SectionHeader
            title="Questions"
            description="What people usually ask before we start."
          />
          <FaqList items={faqs} />
        </Container>
      </Section>

      <Section spacing="sm" className="pb-20 sm:pb-28">
        <Container>
          <div className="flex flex-col items-start gap-6 border-t border-foreground/10 pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-mono">Not sure which fits?</p>
              <h2 className="mt-3 max-w-[26ch] font-heading font-stretch-semi-expanded text-heading font-semibold text-balance text-foreground">
                Tell me what&apos;s wrong or what you need, and I&apos;ll say what it would take.
              </h2>
            </div>
            <ButtonLink href={`${routes.contact}#contact-form`} size="lg" className="group shrink-0">
              Get in touch
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                data-icon="inline-end"
              />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
