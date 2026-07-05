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
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-heading text-sm font-semibold text-foreground">
              {site.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {site.title} · {site.location}
            </p>
          </div>

          <SocialLinks navigation={navigation} />
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
                className="hover:text-foreground"
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
