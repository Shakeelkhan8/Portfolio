import { describe, expect, it } from "vitest";
import {
  certificationSchema,
  pageSchema,
  resumeVersionSchema,
  serviceSchema,
  testimonialSchema,
  validatePageSlug,
} from "@/lib/validators/cms-modules";

describe("page validators", () => {
  it("accepts valid page input", () => {
    const parsed = pageSchema.safeParse({
      slug: "terms",
      title: "Terms of Use",
      contentHtml: "<p>Terms</p>",
      status: "published",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects reserved slugs", () => {
    expect(validatePageSlug("admin")).toBeTruthy();
    expect(validatePageSlug("terms")).toBeNull();
  });
});

describe("certification validators", () => {
  it("requires name and issuer", () => {
    const parsed = certificationSchema.safeParse({
      name: "AWS Certified",
      issuer: "Amazon Web Services",
    });

    expect(parsed.success).toBe(true);
  });
});

describe("testimonial validators", () => {
  it("requires author and content", () => {
    const parsed = testimonialSchema.safeParse({
      authorName: "Jane Doe",
      content: "Great engineer.",
    });

    expect(parsed.success).toBe(true);
  });
});

describe("service validators", () => {
  it("requires title and description", () => {
    const parsed = serviceSchema.safeParse({
      title: "Consulting",
      description: "Architecture reviews.",
    });

    expect(parsed.success).toBe(true);
  });
});

describe("resume version validators", () => {
  it("requires a PDF media id", () => {
    const parsed = resumeVersionSchema.safeParse({
      title: "Resume 2026",
      fileMediaId: "not-a-uuid",
    });

    expect(parsed.success).toBe(false);
  });
});
