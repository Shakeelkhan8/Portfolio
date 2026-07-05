import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Services");

export default function AdminServicesPage() {
  return (
    <AdminPlaceholderPage
      title="Services"
      description="Manage the services you offer with icons and descriptions."
    />
  );
}
