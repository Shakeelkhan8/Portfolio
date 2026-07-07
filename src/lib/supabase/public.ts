import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/env";

export function createPublicSupabaseClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabasePublicKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
