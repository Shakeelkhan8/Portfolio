import type { Metadata } from "next";
import { SocialLinksManager } from "@/components/admin/content/social-links-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getSocialLinkRecords } from "@/lib/db/queries/admin/identity";

export const metadata: Metadata = { title: "Social Links" };

export default async function AdminSocialLinksPage() {
  const links = await getSocialLinkRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Social Links
        </Heading>
        <Text muted className="mt-1">
          Profile links used in structured data and the open-source page.
        </Text>
      </div>
      <SocialLinksManager links={links} />
    </div>
  );
}
