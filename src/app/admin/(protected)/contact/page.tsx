import type { Metadata } from "next";
import { ContactInbox } from "@/components/admin/contact/contact-inbox";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  ADMIN_PAGE_SIZE,
  parsePageParam,
  parseStringParam,
} from "@/lib/admin/pagination";
import { getContactSubmissionsPaginated } from "@/lib/db/queries/admin/contact-submissions";
import type { ContactStatusFilter } from "@/lib/validators/contact";

export const metadata: Metadata = { title: "Contact Inbox" };

type AdminContactPageProps = {
  searchParams: Promise<{
    page?: string;
    status?: string;
    q?: string;
  }>;
};

function parseStatusFilter(value: string): ContactStatusFilter {
  if (value === "unread" || value === "read" || value === "archived") {
    return value;
  }
  return "all";
}

export default async function AdminContactPage({
  searchParams,
}: AdminContactPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const status = parseStatusFilter(parseStringParam(params.status));
  const search = parseStringParam(params.q);
  const result = await getContactSubmissionsPaginated({
    page,
    pageSize: ADMIN_PAGE_SIZE,
    status,
    search,
  });

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
      <ContactInbox result={result} status={status} search={search} />
    </div>
  );
}
