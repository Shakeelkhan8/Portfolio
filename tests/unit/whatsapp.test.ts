import { describe, expect, it } from "vitest";
import { getWhatsAppHref } from "@/lib/contact/whatsapp";

describe("getWhatsAppHref", () => {
  it("builds a wa.me link from a formatted international number", () => {
    expect(getWhatsAppHref("+92 318 0549115")).toBe("https://wa.me/923180549115");
  });

  it("returns null when there is no usable number", () => {
    expect(getWhatsAppHref("")).toBeNull();
    expect(getWhatsAppHref(null)).toBeNull();
    expect(getWhatsAppHref("12345")).toBeNull();
  });
});
