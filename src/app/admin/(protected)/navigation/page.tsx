import type { Metadata } from "next";
import { NavigationManager } from "@/components/admin/content/navigation-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getNavigationItems } from "@/lib/db/queries/navigation";

export const metadata: Metadata = { title: "Navigation" };

export default async function AdminNavigationPage() {
  const items = await getNavigationItems();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Navigation
        </Heading>
        <Text muted className="mt-1">
          Manage main, utility, footer, and social navigation links.
        </Text>
      </div>
      <NavigationManager items={items} />
    </div>
  );
}
