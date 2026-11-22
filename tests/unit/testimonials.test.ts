import { describe, expect, it } from "vitest";
import { parseTestimonialSource } from "@/lib/testimonials";

describe("parseTestimonialSource", () => {
  it("splits the verification out of the company line", () => {
    expect(
      parseTestimonialSource("Client, Sep 2025 (verified on LinkedIn)"),
    ).toEqual({ company: "Client, Sep 2025", verifiedOn: "LinkedIn" });
  });

  it("is case-insensitive and keeps the platform's own capitalisation", () => {
    expect(parseTestimonialSource("Acme (Verified on LinkedIn)")).toEqual({
      company: "Acme",
      verifiedOn: "LinkedIn",
    });
  });

  it("returns unverified text unchanged", () => {
    expect(parseTestimonialSource("Hum Network Limited")).toEqual({
      company: "Hum Network Limited",
      verifiedOn: null,
    });
  });

  it("handles a verification with no company, and empty input", () => {
    expect(parseTestimonialSource("(verified on LinkedIn)")).toEqual({
      company: null,
      verifiedOn: "LinkedIn",
    });
    expect(parseTestimonialSource(null)).toEqual({ company: null, verifiedOn: null });
    expect(parseTestimonialSource("  ")).toEqual({ company: null, verifiedOn: null });
  });
});
