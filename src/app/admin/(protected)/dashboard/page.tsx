import type { Metadata } from "next";
import { DashboardContent } from "@/components/admin/dashboard/dashboard-content";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Dashboard
        </Heading>
        <Text muted className="mt-1">
          Overview of your portfolio content and recent activity.
        </Text>
      </div>
      <DashboardContent />
    </div>
  );
}
