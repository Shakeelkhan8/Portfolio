import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/env";

export function createClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  return createServerClient<Database>(
    getSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware refreshes sessions.
          }
        },
      },
    },
  );
}

/** Convenience wrapper for Server Components and Server Actions. */
export async function createServerSupabaseClient() {
  return createClient(await cookies());
}
