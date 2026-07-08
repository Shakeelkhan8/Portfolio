import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("middleware maintenance optimization", () => {
  it("excludes api and monitoring routes from the matcher", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/middleware.ts"),
      "utf8",
    );

    expect(source).toContain("api/");
    expect(source).toContain("monitoring");
  });

  it("caches maintenance settings with a short TTL", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/supabase/middleware.ts"),
      "utf8",
    );

    expect(source).toContain("MAINTENANCE_CACHE_TTL_MS");
    expect(source).toContain("shouldCheckMaintenance");
    expect(source).toContain("resetMaintenanceCacheForTests");
  });
});
