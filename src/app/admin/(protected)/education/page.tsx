import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Education");

export default function AdminEducationPage() {
  return (
    <AdminPlaceholderPage
      title="Education"
      description="Manage degrees, institutions, dates, and achievements."
    />
  );
}
