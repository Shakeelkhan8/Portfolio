import { createPublicSupabaseClient } from "@/lib/supabase/public";

/**
 * Stateless Supabase client for public CMS reads.
 * Use inside unstable_cache and other non-request contexts — do not call cookies() there.
 */
export function createReadClient() {
  return createPublicSupabaseClient();
}
