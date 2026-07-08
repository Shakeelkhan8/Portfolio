import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  assertProductionSecurityEnv,
  getContactIpSalt,
  resetEnvCacheForTests,
  shouldEnforceProductionSecurityEnv,
} from "@/lib/env";
import { shouldFailClosedForMissingIp } from "@/lib/contact/persist-submission";

describe("production security env", () => {
  const original = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    PORTFOLIO_ENFORCE_PRODUCTION_ENV:
      process.env.PORTFOLIO_ENFORCE_PRODUCTION_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    CONTACT_IP_SALT: process.env.CONTACT_IP_SALT,
  };

  beforeEach(() => {
    resetEnvCacheForTests();
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
    resetEnvCacheForTests();
  });

  it("does not enforce outside Vercel production by default", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.PORTFOLIO_ENFORCE_PRODUCTION_ENV;
    expect(shouldEnforceProductionSecurityEnv()).toBe(false);
  });

  it("enforces when VERCEL_ENV=production", () => {
    process.env.VERCEL_ENV = "production";
    expect(shouldEnforceProductionSecurityEnv()).toBe(true);
  });

  it("uses a non-production salt fallback only when not enforced", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.PORTFOLIO_ENFORCE_PRODUCTION_ENV;
    delete process.env.CONTACT_IP_SALT;
    resetEnvCacheForTests();
    expect(getContactIpSalt()).toContain("dev-only");
  });

  it("rejects missing CONTACT_IP_SALT when production is enforced", () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.CONTACT_IP_SALT;
    resetEnvCacheForTests();
    expect(() => getContactIpSalt()).toThrow(/CONTACT_IP_SALT/);
  });

  it("fails assertProductionSecurityEnv for localhost site URL when enforced", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    process.env.CONTACT_IP_SALT = "a-very-long-unique-salt";
    resetEnvCacheForTests();

    expect(() => assertProductionSecurityEnv()).toThrow(/localhost/);
  });

  it("passes assertProductionSecurityEnv with valid production values", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pub-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    process.env.CONTACT_IP_SALT = "a-very-long-unique-salt";
    resetEnvCacheForTests();

    expect(() => assertProductionSecurityEnv()).not.toThrow();
  });
});

describe("contact rate-limit fail-closed helpers", () => {
  it("fails closed for missing IP only when production is enforced", () => {
    expect(shouldFailClosedForMissingIp(true)).toBe(true);
    expect(shouldFailClosedForMissingIp(false)).toBe(false);
  });
});
