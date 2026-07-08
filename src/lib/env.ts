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
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM: z.string().min(1).optional(),
  CONTACT_EMAIL: z.email().optional(),
  CONTACT_IP_SALT: z.string().min(8).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

const DEV_ONLY_CONTACT_IP_SALT = "dev-only-contact-ip-salt-not-for-production";

let cachedPublicEnv: PublicEnv | null = null;
let cachedServerEnv: ServerEnv | null = null;

/** Test-only helper to re-read process.env between cases. */
export function resetEnvCacheForTests() {
  cachedPublicEnv = null;
  cachedServerEnv = null;
}

/**
 * Enforce stricter contact/CMS env on real Vercel production, or when explicitly opted in.
 * Avoids breaking `next build` in CI (NODE_ENV=production without Vercel production env).
 */
export function shouldEnforceProductionSecurityEnv(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.PORTFOLIO_ENFORCE_PRODUCTION_ENV === "true"
  );
}

function isLocalhostSiteUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    );
  } catch {
    return true;
  }
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
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    CONTACT_IP_SALT: process.env.CONTACT_IP_SALT,
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

export function getContactIpSalt(): string {
  const salt = getServerEnv().CONTACT_IP_SALT;
  if (salt) {
    return salt;
  }

  if (shouldEnforceProductionSecurityEnv()) {
    throw new Error(
      "CONTACT_IP_SALT is required in production. Set a unique random string (16+ chars).",
    );
  }

  return DEV_ONLY_CONTACT_IP_SALT;
}

export function getContactEnv() {
  const serverEnv = getServerEnv();
  return {
    resendApiKey: serverEnv.RESEND_API_KEY,
    resendFrom:
      serverEnv.RESEND_FROM ?? "Portfolio Contact <onboarding@resend.dev>",
    contactEmail: serverEnv.CONTACT_EMAIL,
    ipSalt: getContactIpSalt(),
  };
}

/**
 * Validates production security env. Throws if enforced production is misconfigured.
 * Call from Node runtime instrumentation only.
 */
export function assertProductionSecurityEnv(): void {
  if (!shouldEnforceProductionSecurityEnv()) {
    return;
  }

  const errors: string[] = [];
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    errors.push("NEXT_PUBLIC_SITE_URL must be set explicitly in production.");
  } else if (isLocalhostSiteUrl(publicEnv.NEXT_PUBLIC_SITE_URL)) {
    errors.push(
      "NEXT_PUBLIC_SITE_URL must not point at localhost in production.",
    );
  }

  if (isSupabaseConfigured()) {
    if (!serverEnv.SUPABASE_SERVICE_ROLE_KEY) {
      errors.push(
        "SUPABASE_SERVICE_ROLE_KEY is required when Supabase is configured (contact rate limiting and inserts).",
      );
    }

    if (!serverEnv.CONTACT_IP_SALT || serverEnv.CONTACT_IP_SALT.length < 16) {
      errors.push(
        "CONTACT_IP_SALT must be set to a unique random string of at least 16 characters.",
      );
    }
  }

  if (errors.length) {
    throw new Error(
      `Production security env check failed:\n- ${errors.join("\n- ")}`,
    );
  }
}
