import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Blog");

export default function AdminBlogPage() {
  return (
    <AdminPlaceholderPage
      title="Blog"
      description="Write, publish, and manage articles with rich text and SEO controls."
    />
  );
}
