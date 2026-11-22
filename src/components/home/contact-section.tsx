import { ArrowUpRight, FileDown, FileText } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactCards } from "@/components/home/contact-cards";
import { Reveal } from "@/components/motion/reveal";
import { routes } from "@/config/navigation";
import type { PublicSiteConfig } from "@/types/cms";

type ContactSectionProps = {
  site: PublicSiteConfig;
  /** WhatsApp click-to-chat link derived on the server, or null. */
  whatsappHref?: string | null;
  /** The active resume PDF, or null. */
  resumeUrl?: string | null;
};

type Route = {
  key: string;
  label: string;
  title: string;
  href: string;
  download?: boolean;
  icon: typeof FileText;
};

/**
 * The home page's closing section: a large statement, then the direct routes
 * (email, WhatsApp, LinkedIn and the resume) beside the contact form, so a
 * visitor can write without leaving the page. Layout follows the benchmark
 * portfolio; the copy is the user's own. The phone number is never shown:
 * WhatsApp is a wa.me link derived on the server.
 */
export function ContactSection({
  site,
  whatsappHref = null,
  resumeUrl = null,
}: ContactSectionProps) {
  const email = site.email?.trim() ?? "";
  const availability = site.availability.message?.trim();
  const responseTime = site.responseTimeText?.trim();

  const routesList: Route[] = [
    {
      key: "resume",
      label: "Hiring",
      title: "Read the resume",
      href: routes.resume,
      icon: FileText,
    },
    ...(resumeUrl
      ? [
          {
            key: "pdf",
            label: "Resume",
            title: "Download the PDF",
            href: resumeUrl,
            download: true,
            icon: FileDown,
          },
        ]
      : []),
  ];

  return (
    <div>
      <div
        aria-hidden="true"
        className="section-rule h-px w-full bg-gradient-to-r from-foreground/20 via-foreground/10 to-transparent"
      />
      <Reveal
        direction="up"
        distance={12}
        className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10"
      >
        <h2 className="lg:col-span-8">
          <span className="label-mono mb-5 flex items-center gap-2.5">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
            Contact
            <span className="sr-only">: </span>
          </span>
          <span className="block max-w-[16ch] font-heading font-stretch-semi-expanded text-display font-semibold text-balance text-foreground">
            Have something to build or fix? Let&apos;s talk.
          </span>
        </h2>
        <div className="max-w-md space-y-3 text-pretty text-muted-foreground lg:col-span-4 lg:pb-2">
          {availability ? <p className="leading-relaxed">{availability}</p> : null}
          <p className="leading-relaxed">
            Tell me about the role or the project. I read every message myself
            {responseTime ? ` and reply ${responseTime.charAt(0).toLowerCase()}${responseTime.slice(1).replace(/\.$/, "")}` : ""}.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="flex flex-col gap-8 lg:col-span-5">
          <ContactCards
            email={email}
            linkedin={site.links.linkedin}
            whatsappHref={whatsappHref}
            layout="stack"
          />

          <nav aria-label="Other ways in">
            <p className="label-mono mb-3 text-foreground/60">Other ways in</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {routesList.map((route) => (
                <li key={route.key}>
                  <a
                    href={route.href}
                    {...(route.download
                      ? { download: true, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-5 py-4 transition-colors duration-300 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <route.icon aria-hidden="true" className="size-5 shrink-0 text-signal" />
                    <span className="min-w-0 flex-1">
                      <span className="label-mono block text-foreground/60">{route.label}</span>
                      <span className="mt-1 block text-[0.9375rem] font-medium text-foreground">
                        {route.title}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-foreground/50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    {route.download ? <span className="sr-only">(PDF, opens in a new tab)</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Reveal>

        <Reveal
          delay={0.08}
          className="rounded-3xl border border-foreground/10 bg-foreground/[0.02] p-5 sm:p-8 lg:col-span-7"
        >
          <ContactForm messageClassName="min-h-48 lg:min-h-64" />
        </Reveal>
      </div>
    </div>
  );
}
