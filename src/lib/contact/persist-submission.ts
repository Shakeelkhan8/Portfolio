import { createServiceClient } from "@/lib/supabase/admin";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { getServerEnv, isSupabaseConfigured } from "@/lib/env";
import type { ContactFormInput } from "@/lib/validators/contact";

type PersistContactSubmissionInput = ContactFormInput & {
  ipHash: string | null;
  userAgent: string | null;
};

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

async function isRateLimited(ipHash: string | null) {
  if (!ipHash || !getServerEnv().SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const supabase = createServiceClient();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) {
    return false;
  }

  return (count ?? 0) >= RATE_LIMIT_MAX;
}

export async function persistContactSubmission({
  name,
  email,
  message,
  ipHash,
  userAgent,
}: PersistContactSubmissionInput) {
  if (!isSupabaseConfigured()) {
    return { stored: false as const, reason: "supabase_unconfigured" as const };
  }

  if (await isRateLimited(ipHash)) {
    return { stored: false as const, reason: "rate_limited" as const };
  }

  const payload = {
    name,
    email,
    message,
    status: "unread" as const,
    ip_hash: ipHash,
    user_agent: userAgent,
  };

  const publicClient = createPublicSupabaseClient();
  const publicInsert = await publicClient
    .from("contact_submissions")
    .insert(payload)
    .select("id")
    .single();

  if (!publicInsert.error && publicInsert.data) {
    return { stored: true as const, id: publicInsert.data.id };
  }

  if (!getServerEnv().SUPABASE_SERVICE_ROLE_KEY) {
    return {
      stored: false as const,
      reason: "insert_failed" as const,
      error: publicInsert.error?.message,
    };
  }

  const serviceClient = createServiceClient();
  const serviceInsert = await serviceClient
    .from("contact_submissions")
    .insert(payload)
    .select("id")
    .single();

  if (serviceInsert.error || !serviceInsert.data) {
    return {
      stored: false as const,
      reason: "insert_failed" as const,
      error: serviceInsert.error?.message,
    };
  }

  return { stored: true as const, id: serviceInsert.data.id };
}
