import { describe, expect, it } from "vitest";
import {
  CONTACT_RATE_LIMIT_MAX,
  isContactRateLimitExceeded,
} from "@/lib/contact/rate-limit";

describe("contact rate limiting", () => {
  it("allows submissions below the configured threshold", () => {
    expect(isContactRateLimitExceeded(CONTACT_RATE_LIMIT_MAX - 1)).toBe(false);
  });

  it("blocks submissions at the configured threshold", () => {
    expect(isContactRateLimitExceeded(CONTACT_RATE_LIMIT_MAX)).toBe(true);
    expect(isContactRateLimitExceeded(CONTACT_RATE_LIMIT_MAX + 1)).toBe(true);
  });

  it("documents fail-closed semantics via threshold math", () => {
    // Any count at/above the max is blocked. Count queries that error must
    // be treated as blocked in persist-submission (see production-security-env tests).
    expect(isContactRateLimitExceeded(Number.POSITIVE_INFINITY)).toBe(true);
  });
});
