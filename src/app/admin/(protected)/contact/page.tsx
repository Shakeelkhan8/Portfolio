import type { Metadata } from "next";
import { ContactInbox } from "@/components/admin/contact/contact-inbox";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { getContactSubmissions } from "@/lib/db/queries/admin/contact-submissions";

export const metadata: Metadata = { title: "Contact Inbox" };

export default async function AdminContactPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h1" size="lg" balance={false}>
          Contact Inbox
        </Heading>
        <Text muted className="mt-1">
          Review, search, filter, and export contact form submissions.
        </Text>
      </div>
      <ContactInbox submissions={submissions} />
    </div>
  );
}
