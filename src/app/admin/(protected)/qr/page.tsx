import type { Metadata } from "next";
import { QrManager } from "@/components/admin/content/qr-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getAdminPortfolioQrData } from "@/lib/db/queries/portfolio-qr";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "QR Code" };

export default async function AdminQrPage() {
  const [qr, mediaFiles] = await Promise.all([
    getAdminPortfolioQrData(),
    getMediaFiles(),
  ]);

  if (!qr) {
    return (
      <div className="space-y-2">
        <Heading as="h1" size="lg" balance={false}>
          QR Code
        </Heading>
        <Text muted>
          QR settings are unavailable until Supabase is configured and seeded.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          QR Code
        </Heading>
        <Text muted className="mt-1">
          Generate or upload the portfolio QR shown on the resume page. Change
          it anytime without redeploying.
        </Text>
      </div>
      <QrManager qr={qr} mediaFiles={mediaFiles} />
    </div>
  );
}
