import { describe, expect, it } from "vitest";
import { hashContactIp } from "@/lib/contact/request-meta";
import { contactFormSchema } from "@/lib/validators/contact";

describe("contact validators", () => {
  it("accepts valid contact payloads", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to discuss a backend role.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects short messages", () => {
    const parsed = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hi",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("contact request meta", () => {
  it("hashes ip addresses with a salt", () => {
    const first = hashContactIp("203.0.113.10", "test-salt");
    const second = hashContactIp("203.0.113.10", "test-salt");
    const different = hashContactIp("203.0.113.10", "other-salt");

    expect(first).toBe(second);
    expect(first).not.toBe(different);
  });
});
