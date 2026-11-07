import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} from "next/constants";
import {
  getProductionSecurityEnvErrors,
  resetEnvCacheForTests,
} from "@/lib/env";

vi.mock("../../sentry.server.config", () => ({}));

/**
 * Where the production env check runs. A bad env must fail the build, never
 * the running server: on 2026-11-07 a throw at boot returned 500 for every
 * server-rendered route while cached pages kept loading.
 */
const KEYS = [
  "VERCEL_ENV",
  "NEXT_RUNTIME",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "CONTACT_IP_SALT",
] as const;

const original = Object.fromEntries(KEYS.map((key) => [key, process.env[key]]));

function useProductionEnv(overrides: Partial<Record<(typeof KEYS)[number], string | undefined>> = {}) {
  const values: Record<string, string | undefined> = {
    VERCEL_ENV: "production",
    NEXT_PUBLIC_SITE_URL: "https://example.com",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "pub-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-key",
    CONTACT_IP_SALT: "a-very-long-unique-salt",
    ...overrides,
  };

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
  resetEnvCacheForTests();
}

describe("production env gate", () => {
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
    vi.restoreAllMocks();
  });

  it("server boot logs a bad production env instead of throwing", async () => {
    useProductionEnv({ CONTACT_IP_SALT: undefined });
    process.env.NEXT_RUNTIME = "nodejs";
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    const { register } = await import("@/instrumentation");

    await expect(register()).resolves.toBeUndefined();
    expect(errorLog).toHaveBeenCalledTimes(1);
    expect(String(errorLog.mock.calls[0]?.[0])).toContain("CONTACT_IP_SALT");
  });

  it("production build fails on a bad production env", async () => {
    useProductionEnv({ CONTACT_IP_SALT: undefined });
    const { default: loadConfig } = await import("../../next.config");

    expect(() => loadConfig(PHASE_PRODUCTION_BUILD)).toThrow(
      /Production security env check failed:[\s\S]*CONTACT_IP_SALT/,
    );
  });

  it("production build passes with a valid production env", async () => {
    useProductionEnv();
    const { default: loadConfig } = await import("../../next.config");

    expect(loadConfig(PHASE_PRODUCTION_BUILD).poweredByHeader).toBe(false);
  });

  it("server start does not run the check again", async () => {
    useProductionEnv({ CONTACT_IP_SALT: undefined });
    const { default: loadConfig } = await import("../../next.config");

    expect(loadConfig(PHASE_PRODUCTION_SERVER).poweredByHeader).toBe(false);
  });

  it("reports an invalid variable by name instead of throwing", () => {
    useProductionEnv({ CONTACT_IP_SALT: "short" });

    const errors = getProductionSecurityEnvErrors();

    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/^CONTACT_IP_SALT: /);
  });
});
