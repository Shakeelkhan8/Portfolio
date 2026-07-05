import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  ADMIN_EMAIL: z.email().default("shakeelkhan4147@gmail.com"),
  ADMIN_PASSWORD: z.string().min(12).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

/** Test-only helper to re-read process.env between cases. */
export function resetEnvCacheForTests() {
  cachedPublicEnv = null;
  cachedServerEnv = null;
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  cachedPublicEnv = publicEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  return cachedPublicEnv;
}

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  cachedServerEnv = serverEnvSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  });

  return cachedServerEnv;
}

/** Resolves the Supabase public key (publishable key preferred, anon key as fallback). */
export function getSupabasePublicKey(): string {
  const env = getPublicEnv();
  const key =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY). See .env.example.",
    );
  }

  return key;
}

export function getSupabaseUrl(): string {
  const env = getPublicEnv();

  if (!env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. See .env.example.",
    );
  }

  return env.NEXT_PUBLIC_SUPABASE_URL;
}

export function requireSupabasePublicEnv(): {
  url: string;
  anonKey: string;
} {
  return {
    url: getSupabaseUrl(),
    anonKey: getSupabasePublicKey(),
  };
}

export function requireSupabaseServiceEnv(): {
  url: string;
  serviceRoleKey: string;
} {
  const serverEnv = getServerEnv();

  if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Required for seed and server-side admin operations.",
    );
  }

  return {
    url: getSupabaseUrl(),
    serviceRoleKey: serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function isSupabaseConfigured(): boolean {
  const env = getPublicEnv();
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}
