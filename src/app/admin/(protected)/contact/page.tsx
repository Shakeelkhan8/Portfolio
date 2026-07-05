import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Contact");

export default function AdminContactPage() {
  return (
    <AdminPlaceholderPage
      title="Contact Inbox"
      description="Review, search, filter, and export contact form submissions."
      phase={5}
    />
  );
}
