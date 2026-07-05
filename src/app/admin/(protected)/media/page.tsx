import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Media");

export default function AdminMediaPage() {
  return (
    <AdminPlaceholderPage
      title="Media Library"
      description="Upload, organize, and reuse images, PDFs, and videos."
      phase={3}
    />
  );
}
