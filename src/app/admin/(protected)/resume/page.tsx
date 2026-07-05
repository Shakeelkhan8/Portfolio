import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Resume");

export default function AdminResumePage() {
  return (
    <AdminPlaceholderPage
      title="Resume"
      description="Upload and manage PDF resume versions."
      phase={4}
    />
  );
}
