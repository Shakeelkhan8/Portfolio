import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Certifications");

export default function AdminCertificationsPage() {
  return (
    <AdminPlaceholderPage
      title="Certifications"
      description="Add certificates with issuer details, credential IDs, and images."
    />
  );
}
