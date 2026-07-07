import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { requireSupabaseServiceEnv } from "@/lib/env";

export function createServiceClient() {
  const { url, serviceRoleKey } = requireSupabaseServiceEnv();

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
