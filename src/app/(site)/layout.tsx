import { SiteShell } from "@/components/layout/site-shell";
import { SiteDataProvider } from "@/components/providers/site-data-provider";
import { getSiteConfig } from "@/lib/db/queries/site";
import { getNavigation } from "@/lib/db/queries/navigation";
import { buildSearchIndex } from "@/lib/search";

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

  return (
    <SiteDataProvider
      site={site}
      navigation={navigation}
      searchIndex={searchIndex}
    >
      <SiteShell site={site} navigation={navigation} searchIndex={searchIndex}>
        {children}
      </SiteShell>
    </SiteDataProvider>
  );
}
