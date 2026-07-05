import {
  AdminPlaceholderPage,
  createAdminPlaceholderMetadata,
} from "@/components/admin/shared/admin-placeholder-page";

export const metadata = createAdminPlaceholderMetadata("Skills");

export default function AdminSkillsPage() {
  return (
    <AdminPlaceholderPage
      title="Skills"
      description="Organize skill categories, icons, levels, and display order."
    />
  );
}
