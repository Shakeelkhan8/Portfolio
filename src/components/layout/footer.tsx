import { AppLink } from "@/components/shared/app-link";
import { SocialLinks } from "@/components/shared/social-links";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("mt-auto border-t border-border", className)}>
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="font-heading text-sm font-semibold text-foreground">
              {siteConfig.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {siteConfig.title} · {siteConfig.location}
            </p>
          </div>

          <SocialLinks />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <nav aria-label="Footer navigation" className="flex gap-4">
            {footerNav.map((item) => (
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
