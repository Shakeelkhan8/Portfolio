import type { Metadata } from "next";
import { ServicesManager } from "@/components/admin/content/services-manager";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getServiceRecords } from "@/lib/db/queries/admin/cms-modules";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await getServiceRecords();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Services
        </Heading>
        <Text muted className="mt-1">
          Manage service offerings shown on the home and contact pages.
        </Text>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}
