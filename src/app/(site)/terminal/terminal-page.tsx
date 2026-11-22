import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { AvailabilityBadge } from "@/components/shared/availability-badge";
import { Terminal } from "@/components/terminal/terminal";
import { routes } from "@/config/navigation";
import {
  formatDateRange,
  getActiveResumeVersion,
  getExperience,
  getProjects,
  getSiteConfig,
  getSkillGroups,
} from "@/lib/content";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";
import { projectContext } from "@/lib/projects";
import { toPublicSiteConfig } from "@/lib/public-site";
import type { TerminalData } from "@/lib/terminal/commands";

/**
 * The portfolio as a command line (benchmark: thefahadshakir.com/terminal;
 * the commands and copy are the user's own). A profile panel on the left,
 * the terminal on the right. Everything passed to the client is already
 * public: location, city and phone are private site fields (public-site.ts)
 * and never reach it; the phone only ever becomes a wa.me link here.
 */
export default async function TerminalPage() {
  const [rawSite, projects, skillGroups, experience, activeResume] = await Promise.all([
    getSiteConfig(),
    getProjects(),
    getSkillGroups(),
    getExperience(),
    getActiveResumeVersion(),
  ]);
  const site = toPublicSiteConfig(rawSite);
  const whatsappHref = getWhatsAppHref(rawSite.phone);

  const data: TerminalData = {
    name: site.name,
    title: site.title,
    intro: site.description,
    availability: site.availability.message?.trim() ?? "",
    email: site.email?.trim() ?? "",
    links: [
      { label: "GitHub", href: site.links.github },
      { label: "LinkedIn", href: site.links.linkedin },
      ...(whatsappHref ? [{ label: "WhatsApp", href: whatsappHref }] : []),
    ].filter((link) => Boolean(link.href)),
    resumePdf: activeResume?.fileUrl ?? null,
    projects: projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      status: projectContext(project).status,
      stack: project.stack,
    })),
    skills: skillGroups.map((group) => ({ category: group.category, skills: group.skills })),
    experience: experience.map((entry) => ({
      role: entry.role,
      company: entry.company,
      period: formatDateRange(entry.startDate, entry.endDate),
    })),
  };

  return (
    <Section spacing="sm" className="relative">
      <Container size="wide">
        <h1 className="sr-only">Terminal</h1>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-8">
          <aside
            aria-label="Profile"
            className="flex flex-col rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6"
          >
            <p className="label-mono flex items-center gap-2 text-signal">
              <span aria-hidden="true">›_</span> Terminal
            </p>
            <p className="mt-4 font-heading text-subheading font-semibold text-foreground">
              {site.name}
            </p>
            <p className="mt-1 text-sm text-foreground/70">{site.title}</p>
            {site.description ? (
              <p className="mt-4 text-sm leading-relaxed text-pretty text-muted-foreground">
                {site.description}
              </p>
            ) : null}
            <div className="mt-5">
              <AvailabilityBadge site={site} />
            </div>
            <div className="mt-8 flex flex-col gap-2.5 lg:mt-auto lg:pt-8">
              <Link
                href={routes.home}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back to the main site
              </Link>
              <Link
                href={routes.resume}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FileText aria-hidden="true" className="size-4" />
                Resume
              </Link>
            </div>
          </aside>

          <div className="h-[72vh] min-h-[28rem] lg:h-[78vh]">
            <Terminal data={data} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
