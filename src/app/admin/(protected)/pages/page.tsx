import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Pages");

export default function AdminPagesPage() {
  return (
    <AdminPlaceholderPage
      title="Custom Pages"
      description="Create and publish custom pages such as privacy policy and landing pages."
    />
  );
}
