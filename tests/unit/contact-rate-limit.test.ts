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
});
