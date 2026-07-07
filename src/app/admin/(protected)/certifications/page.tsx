import type { Metadata } from "next";
import { CertificationsManager } from "@/components/admin/content/certifications-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getCertificationRecords } from "@/lib/db/queries/admin/cms-modules";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Certifications" };

export default async function AdminCertificationsPage() {
  const [certifications, mediaFiles] = await Promise.all([
    getCertificationRecords(),
    getMediaFiles(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Certifications
        </Heading>
        <Text muted className="mt-1">
          Manage professional certifications shown on the resume page.
        </Text>
      </div>
      <CertificationsManager
        certifications={certifications}
        mediaFiles={mediaFiles}
      />
    </div>
  );
}
