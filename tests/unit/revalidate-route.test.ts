import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidateAllPublicContent = vi.fn();
vi.mock("@/lib/db/revalidate", () => ({ revalidateAllPublicContent }));

const { POST } = await import("@/app/api/revalidate/route");
const { checkRevalidateAuth } = await import("@/lib/security/revalidate-secret");

const SECRET = "s".repeat(40);
const call = (authorization?: string) =>
  POST(
    new Request("https://example.test/api/revalidate", {
      method: "POST",
      headers: authorization ? { authorization } : {},
    }),
  );

describe("checkRevalidateAuth", () => {
  it("is disabled without a long enough secret", () => {
    expect(checkRevalidateAuth(`Bearer ${SECRET}`, undefined)).toBe("disabled");
    expect(checkRevalidateAuth("Bearer short", "short")).toBe("disabled");
  });

  it("accepts only the exact bearer secret", () => {
    expect(checkRevalidateAuth(`Bearer ${SECRET}`, SECRET)).toBe("ok");
    expect(checkRevalidateAuth(`Bearer ${SECRET}x`, SECRET)).toBe("denied");
    expect(checkRevalidateAuth(SECRET, SECRET)).toBe("denied");
    expect(checkRevalidateAuth(null, SECRET)).toBe("denied");
  });
});

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateAllPublicContent.mockClear();
    vi.stubEnv("CONTENT_REVALIDATE_SECRET", SECRET);
    vi.stubEnv("VERCEL_GIT_COMMIT_SHA", "abc123");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("refreshes every public page and reports the commit", async () => {
    const response = await call(`Bearer ${SECRET}`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ revalidated: true, commit: "abc123" });
    expect(revalidateAllPublicContent).toHaveBeenCalledTimes(1);
  });

  it("rejects a wrong or missing secret without refreshing", async () => {
    expect((await call("Bearer wrong")).status).toBe(401);
    expect((await call()).status).toBe(401);
    expect(revalidateAllPublicContent).not.toHaveBeenCalled();
  });

  it("stays off until the secret is configured", async () => {
    vi.stubEnv("CONTENT_REVALIDATE_SECRET", "");
    expect((await call(`Bearer ${SECRET}`)).status).toBe(503);
    expect(revalidateAllPublicContent).not.toHaveBeenCalled();
  });
});
