import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { AppLink } from "@/components/shared/app-link";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import { getSiteConfig } from "@/lib/content";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-foreground/10 pt-4">
      <p className="label-mono mb-2">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

const linkClass = "link-draw font-medium text-foreground";

export default async function ContactPage() {
  const site = await getSiteConfig();
  const profiles = [
    { label: "LinkedIn", href: site.links.linkedin },
    { label: "GitHub", href: site.links.github },
  ].filter((profile): profile is { label: string; href: string } =>
    Boolean(profile.href),
  );

  return (
    <>
      <PageHeader
        title="Contact"
        heading="Have something to build or fix? Let's talk."
        description="Whether it's a role to fill, a web or mobile app to build, a payment integration, a slow or buggy app to fix, or an AI feature, tell me what you need."
      >
        <AvailabilityBadge site={site} />
      </PageHeader>

      <Section spacing="sm" className="pt-0">
        <Container className="grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
          <Reveal id="contact-form" className="scroll-mt-28 lg:col-span-3">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2">
            <aside className="space-y-5" aria-label="Contact details">
              {site.email ? (
                <DetailRow label="Email">
                  <a href={getMailtoHref(site.email)} className={linkClass}>
                    {getPublicEmailLabel(site.email, { preferAddress: true })}
                  </a>
                </DetailRow>
              ) : null}
              {profiles.length > 0 ? (
                <DetailRow label="Profiles">
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {profiles.map((profile) => (
                      <li key={profile.label}>
                        <AppLink
                          href={profile.href}
                          showExternalIcon
                          className={linkClass}
                        >
                          {profile.label}
                        </AppLink>
                      </li>
                    ))}
                  </ul>
                </DetailRow>
              ) : null}
              {getWhatsAppHref(site.phone) ? (
                <DetailRow label="WhatsApp">
                  <AppLink
                    href={getWhatsAppHref(site.phone)!}
                    showExternalIcon
                    className={linkClass}
                  >
                    Message on WhatsApp
                  </AppLink>
                </DetailRow>
              ) : null}
              {site.responseTimeText ? (
                <DetailRow label="Response time">
                  <p className="text-muted-foreground">{site.responseTimeText}</p>
                </DetailRow>
              ) : null}
            </aside>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
