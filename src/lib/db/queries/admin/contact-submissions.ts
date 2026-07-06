import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
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

export async function getContactSubmissions(
  options: GetContactSubmissionsOptions = {},
): Promise<ContactSubmissionRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createClient();
  let query = supabase
    .from("contact_submissions")
    .select(
      "id, name, email, message, status, ip_hash, user_agent, read_at, created_at",
    )
    .order("created_at", { ascending: false });

  if (options.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  const submissions = data.map(mapContactSubmission);
  const search = options.search?.trim().toLowerCase();

  if (!search) {
    return submissions;
  }

  return submissions.filter((submission) => {
    const haystack =
      `${submission.name} ${submission.email} ${submission.message}`.toLowerCase();
    return haystack.includes(search);
  });
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
