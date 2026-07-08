import { AppLink } from "@/components/shared/app-link";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import type { NavigationData, SiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type FooterProps = {
  site: SiteConfig;
  navigation: NavigationData;
  className?: string;
};

export function Footer({ site, navigation, className }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright =
    site.copyrightText || `© ${year} ${site.name}. All rights reserved.`;

  return (
    <footer role="contentinfo" className={cn("mt-auto border-t border-border", className)}>
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
              <span
                className="inline-block size-2 rounded-full bg-primary"
                aria-hidden="true"
              />
              {site.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {site.title} · {site.location}
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            {navigation.utilityNav.length > 0 ? (
              <nav aria-label="More site links" className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  More
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  {navigation.utilityNav.map((item) => (
                    <AppLink
                      key={item.href}
                      href={item.href}
                      external={item.external}
                      showExternalIcon={false}
                      className="rounded-sm text-foreground transition-colors hover:text-primary"
                    >
                      {item.title}
                    </AppLink>
                  ))}
                </div>
              </nav>
            ) : null}
            <SocialLinks navigation={navigation} />
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright.replace(String(year), String(year))}</p>
          <nav aria-label="Footer navigation" className="flex gap-4">
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
