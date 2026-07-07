import { describe, expect, it, beforeEach } from "vitest";
import {
  getPublicEnv,
  isSupabaseConfigured,
  resetEnvCacheForTests,
} from "@/lib/env";

describe("env", () => {
  beforeEach(() => {
    resetEnvCacheForTests();
  });

  it("provides default site URL when unset", () => {
    const env = getPublicEnv();
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("detects when Supabase is not configured", () => {
    const originalPublishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const originalAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    expect(isSupabaseConfigured()).toBe(false);

    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalPublishable;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnon;
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    resetEnvCacheForTests();
  });
});
