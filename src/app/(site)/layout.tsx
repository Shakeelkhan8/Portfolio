import { SiteShell } from "@/components/layout/site-shell";
import { SiteDataProvider } from "@/components/providers/site-data-provider";
import { getSiteConfig } from "@/lib/db/queries/site";
import { getNavigation } from "@/lib/db/queries/navigation";
import { buildSearchIndex } from "@/lib/search";
import { toPublicSiteConfig } from "@/lib/public-site";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, navigation, searchIndex] = await Promise.all([
    getSiteConfig(),
    getNavigation(),
    buildSearchIndex(),
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
      >
        {children}
      </SiteShell>
    </SiteDataProvider>
  );
}
