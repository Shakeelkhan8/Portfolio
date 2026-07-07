import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/db/queries/site";
import {
  getPersonSchema,
  getProfilePageSchema,
  getWebSiteSchema,
} from "@/lib/structured-data";

export async function RootJsonLd() {
  const site = await getSiteConfig();

  return (
    <JsonLd
      data={[getPersonSchema(site), getWebSiteSchema(site), getProfilePageSchema(site)]}
    />
  );
}
