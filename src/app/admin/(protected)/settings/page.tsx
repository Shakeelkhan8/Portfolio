import type { Metadata } from "next";
import { SettingsManager } from "@/components/admin/settings/settings-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getAdminSettingsData } from "@/lib/db/queries/settings";
import { getMediaFiles } from "@/lib/db/queries/media";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const [settings, mediaFiles] = await Promise.all([
    getAdminSettingsData(),
    getMediaFiles(),
  ]);

  if (!settings) {
    return (
      <div className="space-y-2">
        <Heading as="h1" size="lg" balance={false}>
          Settings
        </Heading>
        <Text muted>
          Settings are unavailable until Supabase is configured and seeded.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Settings
        </Heading>
        <Text muted className="mt-1">
          Manage branding, SEO defaults, theme, analytics, scripts, and maintenance mode.
        </Text>
      </div>
      <SettingsManager settings={settings} mediaFiles={mediaFiles} />
    </div>
  );
}
