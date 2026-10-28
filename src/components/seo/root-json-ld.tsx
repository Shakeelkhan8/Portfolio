import { JsonLd } from "@/components/seo/json-ld";
import { getSiteConfig } from "@/lib/db/queries/site";
import { getRootSchemaGraph } from "@/lib/structured-data";

export async function RootJsonLd() {
  const site = await getSiteConfig();

  return <JsonLd data={getRootSchemaGraph(site)} />;
}
