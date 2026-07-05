import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Testimonials");

export default function AdminTestimonialsPage() {
  return (
    <AdminPlaceholderPage
      title="Testimonials"
      description="Manage client and colleague testimonials with avatars and visibility."
    />
  );
}
