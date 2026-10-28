import { ButtonLink } from "@/components/shared/button-link";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import {
  getMailtoHref,
  getPublicEmailLabel,
} from "@/lib/contact/email-display";
import type { ServiceRecord, SiteConfig } from "@/types/cms";

type ContactCTAProps = {
  site: SiteConfig;
  services: ServiceRecord[];
};

/**
 * Two ways in: hiring managers looking at a role, and clients with a project.
 * Each path gets its own call to action rather than one generic "contact me".
 */
export function ContactCTA({ site, services }: ContactCTAProps) {
  const email = site.email?.trim() ?? "";

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
      <Reveal className="flex flex-col border-t border-border pt-6">
        <h3 className="font-heading text-2xl text-foreground">
          Hiring for a backend role?
        </h3>
        <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
          I&apos;m looking for remote senior backend roles on product teams that
          care about reliability. The resume has the detail; email is the
          quickest way to reach me.
        </p>
        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <ButtonLink href={routes.resume} size="lg" className="min-h-11 px-5">
            Read the resume
          </ButtonLink>
          {email ? (
            <ButtonLink
              href={getMailtoHref(email)}
              variant="outline"
              size="lg"
              className="min-h-11 bg-transparent px-5"
            >
              {getPublicEmailLabel(email)}
            </ButtonLink>
          ) : null}
        </div>
      </Reveal>

      <Reveal className="flex flex-col border-t border-border pt-6">
        <h3 className="font-heading text-2xl text-foreground">
          Need something built or fixed?
        </h3>
        <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">
          I take on a small number of projects alongside my main role.
        </p>
        {services.length > 0 ? (
          <ul className="mt-5 space-y-4">
            {services.map((service) => (
              <li key={service.id}>
                <p className="font-medium text-foreground">{service.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto pt-7">
          <ButtonLink
            href={routes.contact}
            variant="outline"
            size="lg"
            className="min-h-11 bg-transparent px-5"
          >
            Start a conversation
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
