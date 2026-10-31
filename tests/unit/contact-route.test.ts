import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SITE = "http://localhost:3000";

function validRequest() {
  return new Request(`${SITE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: SITE },
    body: JSON.stringify({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to discuss a backend role.",
    }),
  });
}

// Production on Vercel with CONTACT_IP_SALT blank (fails env validation) or
// unset (getContactIpSalt() refuses to fall back). Both used to throw out of
// the handler, so the browser got an empty 500 and the form crashed on
// response.json().
describe.each([
  ["blank", ""],
  ["unset", undefined],
])("POST /api/contact with CONTACT_IP_SALT %s in production", (_label, salt) => {
  beforeEach(() => {
    // env.ts caches parsed env at module level, so load the route fresh.
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE);
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("CONTACT_IP_SALT", salt);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("answers with a JSON error and a fallback email instead of an empty 500", async () => {
    const { POST } = await import("@/app/api/contact/route");

    const response = await POST(validRequest());

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = (await response.json()) as { error?: string; fallbackEmail?: string };
    expect(body.error).toMatch(/email/i);
    expect(body.fallbackEmail).toBe("shakeelkhan4147@gmail.com");
  });
});
