import type { ReactNode } from "react";
import { Container } from "@/components/layout/container";
import { ContentSection } from "@/components/layout/content-section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { ContactForm } from "@/components/contact/contact-form";
import { ServicesSection } from "@/components/home/services-section";
import { getMailtoHref } from "@/lib/contact/email-display";
import { getServices, getSiteConfig } from "@/lib/content";

export default async function ContactPage() {
  const [site, services] = await Promise.all([getSiteConfig(), getServices()]);

  type Detail = { term: string; detail: ReactNode };

  const details: Array<Detail | null> = [
    {
      term: "Email",
      detail: (
        <a
          href={getMailtoHref(site.email)}
          className="link-underline text-foreground"
        >
          {site.email}
        </a>
      ),
    },
    {
      term: "Based in",
      detail: `${site.city}, ${site.location} (${site.timezone})`,
    },
    site.responseTimeText
      ? { term: "Replies", detail: site.responseTimeText }
      : null,
  ];
  const visibleDetails = details.filter(
    (item): item is Detail => item !== null,
  );

  return (
    <>
      <PageHeader
        title="Get in touch"
        description="Hiring for a backend role, or have a project in mind? Tell me a little about it and I'll reply by email."
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <aside aria-label="Contact details" className="lg:col-span-5">
          <dl className="divide-y divide-border border-y border-border">
            {visibleDetails.map((item) => (
              <div
                key={item.term}
                className="grid grid-cols-[6.5rem_1fr] gap-3 py-4"
              >
                <dt className="label-mono pt-0.5">{item.term}</dt>
                <dd className="text-sm leading-relaxed text-foreground">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </Container>

      {services.length > 0 ? (
        <ContentSection
          id="services"
          title="Project work"
          description="What I take on alongside my main role."
        >
          <ServicesSection services={services} />
        </ContentSection>
      ) : null}
    </>
  );
}
