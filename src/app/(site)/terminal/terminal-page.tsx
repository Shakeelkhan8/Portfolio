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

  const initials = site.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const shortcuts: Array<[string, string]> = [
    ["Tab", "complete a command or project"],
    ["↑ ↓", "go through what you typed"],
    ["Ctrl L", "clear the screen"],
    ["exit", "back to the main site"],
  ];

  return (
    <Section spacing="sm" className="relative">
      <Container size="wide">
        <h1 className="sr-only">Terminal</h1>
        {/* grid-cols-1 (minmax(0, 1fr)) on phones: an implicit column grew to
            the widest unwrapped line and pushed both cards off the screen. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-8">
          <aside
            aria-label="Profile"
            className="flex flex-col gap-6 self-start rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]"
          >
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-signal/30 bg-gradient-to-br from-signal/20 to-transparent font-heading text-lg font-semibold text-foreground"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <p className="label-mono flex items-center gap-1.5 text-signal">
                  <span aria-hidden="true">›_</span> Terminal
                </p>
                <p className="mt-1 truncate font-heading text-subheading font-semibold text-foreground">
                  {site.name}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-foreground/75">{site.title}</p>
              <AvailabilityBadge site={site} />
            </div>
            {/* Keyboard shortcuts mean little on a phone; the panel stays short there. */}
            <div className="hidden lg:block">
              <p className="label-mono mb-3 text-foreground/60">Shortcuts</p>
              <dl className="space-y-2 text-sm">
                {shortcuts.map(([key, action]) => (
                  <div key={key} className="flex items-center gap-3">
                    <dt className="min-w-[3.75rem]">
                      <kbd className="rounded-md border border-b-2 border-foreground/15 bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-foreground/80">
                        {key}
                      </kbd>
                    </dt>
                    <dd className="text-muted-foreground">{action}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-1">
              <Link
                href={routes.home}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
                <span className="lg:hidden">Back</span>
                <span className="hidden lg:inline">Back to the main site</span>
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

          <div className="h-[calc(100dvh-var(--header-height)-5rem)] min-h-[34rem] max-h-[56rem]">
            <Terminal data={data} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
