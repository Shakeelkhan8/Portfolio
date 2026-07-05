import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Settings");

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      title="Settings"
      description="Configure branding, theme, SEO defaults, analytics, scripts, and maintenance mode."
      phase={6}
    />
  );
}
