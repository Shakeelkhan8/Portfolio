import type { Metadata } from "next";
import { ResumeManager } from "@/components/admin/content/resume-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getResumeVersionRecords } from "@/lib/db/queries/admin/cms-modules";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Resume" };

export default async function AdminResumePage() {
  const [versions, mediaFiles] = await Promise.all([
    getResumeVersionRecords(),
    getMediaFiles(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Resume
        </Heading>
        <Text muted className="mt-1">
          Upload PDF resume versions and choose which file visitors can download.
        </Text>
      </div>
      <ResumeManager versions={versions} mediaFiles={mediaFiles} />
    </div>
  );
}
