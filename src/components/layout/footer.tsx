import { AppLink } from "@/components/shared/app-link";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "@/components/layout/container";
import { getMailtoHref } from "@/lib/contact/email-display";
import type { NavigationData, SiteConfig } from "@/types/cms";
import { cn } from "@/lib/utils";

type FooterProps = {
  site: SiteConfig;
  navigation: NavigationData;
  className?: string;
};

export function Footer({ site, navigation, className }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = site.copyrightText || `© ${year} ${site.name}`;
  const siteLinks = [...navigation.mainNav, ...navigation.utilityNav];

  return (
    <footer className={cn("mt-auto border-t border-border", className)}>
      <Container className="grid gap-10 py-14 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <p className="font-heading text-2xl text-foreground">{site.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {site.title} ·{" "}
            {[site.city, site.location].filter(Boolean).join(", ")}
          </p>
          {site.email ? (
            <a
              href={getMailtoHref(site.email)}
              className="link-underline mt-5 inline-block text-sm text-foreground"
            >
              {site.email}
            </a>
          ) : null}
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <p className="label-mono">Site</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {siteLinks.map((item) => (
              <li key={item.href}>
                <AppLink
                  href={item.href}
                  external={item.external}
                  showExternalIcon={false}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.title}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="label-mono">Elsewhere</p>
          <SocialLinks navigation={navigation} className="mt-3" />
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{copyright}</p>
        {navigation.footerNav.length > 0 ? (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {navigation.footerNav.map((item) => (
              <li key={item.href}>
                <AppLink
                  href={item.href}
                  external={item.external}
                  showExternalIcon={false}
                  className="hover:text-foreground"
                >
                  {item.title}
                </AppLink>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </footer>
  );
}
