import { AppLink } from "@/components/shared/app-link";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "@/components/layout/container";
import type { NavigationData, PublicSiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";
import { routes } from "@/config/navigation";

type FooterProps = {
  site: PublicSiteConfig;
  navigation: NavigationData;
  /** Active CMS resume PDF; without one only the web resume is linked. */
  resumeUrl?: string | null;
  className?: string;
};

export function Footer({ site, navigation, resumeUrl = null, className }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright =
    site.copyrightText || `© ${year} ${site.name}. All rights reserved.`;

  return (
    <footer
      role="contentinfo"
      className={cn("relative mt-auto overflow-hidden", className)}
    >
      <Container className="py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <p className="flex items-center gap-2.5 font-heading text-base font-semibold tracking-tight text-foreground">
              <span
                className="inline-block size-2 rounded-full bg-foreground"
                aria-hidden="true"
              />
              {site.name}
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {site.title}
            </p>
            {/* Every width: the side tab only shows from 1280px. */}
            <AppLink
              href={routes.terminal}
              showExternalIcon={false}
              className="inline-flex items-center gap-2 rounded-sm font-mono text-xs text-foreground/70 transition-colors hover:text-signal"
            >
              <span aria-hidden="true" className="text-signal">›_</span>
              Open the terminal
            </AppLink>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
            {navigation.utilityNav.length > 0 ? (
              <nav aria-label="More site links" className="flex flex-col gap-3">
                <p className="font-mono text-[10px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                  More
                </p>
                <div className="flex flex-col gap-2.5 text-sm">
                  {navigation.utilityNav.map((item) => (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      external={item.external}
                      showExternalIcon={false}
                      className="rounded-sm text-foreground/85 transition-colors hover:text-primary"
                    >
                      {item.title}
                    </AppLink>
                  ))}
                </div>
              </nav>
            ) : null}
            <nav aria-label="Resume" className="flex flex-col gap-3">
              <p className="font-mono text-[10px] font-medium tracking-[0.28em] text-muted-foreground uppercase">
                Resume
              </p>
              <div className="flex flex-col gap-2.5 text-sm">
                <AppLink
                  href={routes.resume}
                  showExternalIcon={false}
                  className="rounded-sm text-foreground/85 transition-colors hover:text-primary"
                >
                  View resume
                </AppLink>
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm text-foreground/85 transition-colors hover:text-primary"
                  >
                    Download PDF
                  </a>
                ) : null}
              </div>
            </nav>
            <SocialLinks navigation={navigation} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 pt-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright.replace(String(year), String(year))}</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.footerNav.map((item) => (
              <AppLink
                key={item.href}
                href={item.href}
                external={item.external}
                showExternalIcon={false}
                className="rounded-sm transition-colors hover:text-foreground"
              >
                {item.title}
              </AppLink>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
