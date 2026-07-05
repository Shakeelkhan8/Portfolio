import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Projects");

export default function AdminProjectsPage() {
  return (
    <AdminPlaceholderPage
      title="Projects"
      description="Manage portfolio case studies, categories, media, and SEO."
    />
  );
}
