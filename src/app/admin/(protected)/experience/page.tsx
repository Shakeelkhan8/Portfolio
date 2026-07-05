import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Experience");

export default function AdminExperiencePage() {
  return (
    <AdminPlaceholderPage
      title="Experience"
      description="Manage work history, highlights, technologies, and ordering."
    />
  );
}
