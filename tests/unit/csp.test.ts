import { describe, expect, it } from "vitest";
import { CONTENT_SECURITY_POLICY } from "@/lib/security/headers";

describe("Content-Security-Policy", () => {
  it("locks down high-risk directives", () => {
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("base-uri 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'");
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("form-action 'self'");
    expect(CONTENT_SECURITY_POLICY).toContain("upgrade-insecure-requests");
  });

  it("does not permit eval-based script execution", () => {
    expect(CONTENT_SECURITY_POLICY).not.toContain("'unsafe-eval'");
  });
});
