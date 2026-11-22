import { SiteShell } from "@/components/layout/site-shell";
import { SiteDataProvider } from "@/components/providers/site-data-provider";
import { getSiteConfig } from "@/lib/db/queries/site";
import { getNavigation } from "@/lib/db/queries/navigation";
import { getActiveResumeVersion } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";
import { toPublicSiteConfig } from "@/lib/public-site";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, navigation, searchIndex, activeResume] = await Promise.all([
    getSiteConfig(),
    getNavigation(),
    buildSearchIndex(),
    getActiveResumeVersion(),
  ]);
  // Everything below is serialised into the page; keep personal fields out.
  const publicSite = toPublicSiteConfig(site);

  return (
    <SiteDataProvider
      site={publicSite}
      navigation={navigation}
      searchIndex={searchIndex}
    >
      <SiteShell
        site={publicSite}
        navigation={navigation}
        searchIndex={searchIndex}
        resumeUrl={activeResume?.fileUrl ?? null}
        // Only the wa.me link reaches the page; the phone field stays private.
        whatsappHref={getWhatsAppHref(site.phone)}
      >
        {children}
      </SiteShell>
    </SiteDataProvider>
  );
}
