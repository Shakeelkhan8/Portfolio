import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  buildPaginatedResult,
  getRange,
  type PaginatedResult,
} from "@/lib/admin/pagination";
import type { ContactSubmissionRecord } from "@/types/cms";
import type { ContactStatusFilter } from "@/lib/validators/contact";

function mapContactSubmission(row: {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "unread" | "read" | "archived";
  ip_hash: string | null;
  user_agent: string | null;
  read_at: string | null;
  created_at: string;
}): ContactSubmissionRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    ipHash: row.ip_hash,
    userAgent: row.user_agent,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

type GetContactSubmissionsOptions = {
  status?: ContactStatusFilter;
  search?: string;
};

function applyContactFilters<
  T extends {
    eq: (column: string, value: string) => T;
    or: (filters: string) => T;
  },
>(query: T, options: GetContactSubmissionsOptions) {
  let next = query;

  if (options.status && options.status !== "all") {
    next = next.eq("status", options.status);
  }

  const search = options.search?.trim();
  if (search) {
    const pattern = `%${search.replace(/[%_]/g, "")}%`;
    next = next.or(
      `name.ilike.${pattern},email.ilike.${pattern},message.ilike.${pattern}`,
    );
  }

  return next;
}

export async function getContactSubmissions(
  options: GetContactSubmissionsOptions = {},
): Promise<ContactSubmissionRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  const query = applyContactFilters(
    supabase
      .from("contact_submissions")
      .select(
        "id, name, email, message, status, ip_hash, user_agent, read_at, created_at",
      )
      .order("created_at", { ascending: false }),
    options,
  );

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  return data.map(mapContactSubmission);
}

type GetContactSubmissionsPaginatedOptions = GetContactSubmissionsOptions & {
  page: number;
  pageSize: number;
};

export async function getContactSubmissionsPaginated(
  options: GetContactSubmissionsPaginatedOptions,
): Promise<PaginatedResult<ContactSubmissionRecord>> {
  if (!isSupabaseConfigured()) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  const supabase = await createClient();
  const { from, to } = getRange(options.page, options.pageSize);
  const query = applyContactFilters(
    supabase
      .from("contact_submissions")
      .select(
        "id, name, email, message, status, ip_hash, user_agent, read_at, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(from, to),
    options,
  );

  const { data, count, error } = await query;

  if (error || !data) {
    return buildPaginatedResult([], 0, options.page, options.pageSize);
  }

  return buildPaginatedResult(
    data.map(mapContactSubmission),
    count ?? 0,
    options.page,
    options.pageSize,
  );
}

export async function getContactSubmissionById(
  id: string,
): Promise<ContactSubmissionRecord | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select(
      "id, name, email, message, status, ip_hash, user_agent, read_at, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapContactSubmission(data);
}

export function contactSubmissionsToCsv(
  submissions: ContactSubmissionRecord[],
) {
  const header = ["created_at", "status", "name", "email", "message"];
  const rows = submissions.map((submission) =>
    [
      submission.createdAt,
      submission.status,
      submission.name,
      submission.email,
      submission.message.replace(/\r?\n/g, " "),
    ]
      .map((value) => `"${value.replace(/"/g, '""')}"`)
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}
