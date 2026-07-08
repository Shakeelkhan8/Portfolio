import { createServiceClient } from "@/lib/supabase/admin";
import {
  getServerEnv,
  isSupabaseConfigured,
  shouldEnforceProductionSecurityEnv,
} from "@/lib/env";
import {
  CONTACT_RATE_LIMIT_WINDOW_MS,
  isContactRateLimitExceeded,
} from "@/lib/contact/rate-limit";
import type { ContactFormInput } from "@/lib/validators/contact";

type PersistContactSubmissionInput = ContactFormInput & {
  ipHash: string | null;
  userAgent: string | null;
};

export type PersistContactResult =
  | { stored: true; id: string }
  | {
      stored: false;
      reason:
        | "supabase_unconfigured"
        | "service_role_missing"
        | "rate_limited"
        | "insert_failed";
      error?: string;
    };

const RATE_LIMIT_WINDOW_MS = CONTACT_RATE_LIMIT_WINDOW_MS;

/**
 * Fail closed: if we cannot attribute or count submissions safely, treat as limited.
 * Missing IP is allowed only outside enforced production so local/dev still works.
 */
export function shouldFailClosedForMissingIp(
  enforceProduction = shouldEnforceProductionSecurityEnv(),
): boolean {
  return enforceProduction;
}

async function isRateLimited(ipHash: string | null): Promise<boolean> {
  if (!getServerEnv().SUPABASE_SERVICE_ROLE_KEY) {
    return true;
  }

  if (!ipHash) {
    return shouldFailClosedForMissingIp();
  }

  try {
    const supabase = createServiceClient();
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();

    const { count, error } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);

    if (error) {
      return true;
    }

    return isContactRateLimitExceeded(count ?? 0);
  } catch {
    return true;
  }
}

export async function persistContactSubmission({
  name,
  email,
  message,
  ipHash,
  userAgent,
}: PersistContactSubmissionInput): Promise<PersistContactResult> {
  if (!isSupabaseConfigured()) {
    return { stored: false, reason: "supabase_unconfigured" };
  }

  if (!getServerEnv().SUPABASE_SERVICE_ROLE_KEY) {
    return { stored: false, reason: "service_role_missing" };
  }

  if (await isRateLimited(ipHash)) {
    return { stored: false, reason: "rate_limited" };
  }

  const payload = {
    name,
    email,
    message,
    status: "unread" as const,
    ip_hash: ipHash,
    user_agent: userAgent,
  };

  try {
    const serviceClient = createServiceClient();
    const { data, error } = await serviceClient
      .from("contact_submissions")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      return {
        stored: false,
        reason: "insert_failed",
        error: error?.message,
      };
    }

    return { stored: true, id: data.id };
  } catch (error) {
    return {
      stored: false,
      reason: "insert_failed",
      error: error instanceof Error ? error.message : "Unknown insert error",
    };
  }
}
