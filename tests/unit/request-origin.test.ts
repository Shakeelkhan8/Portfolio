import { describe, expect, it } from "vitest";
import { isTrustedSiteRequest } from "@/lib/security/request-origin";

const siteUrl = "https://portfolio.example";

function makeRequest(headers: Record<string, string>) {
  return new Request("https://portfolio.example/api/contact", {
    method: "POST",
    headers,
  });
}

describe("isTrustedSiteRequest", () => {
  it("accepts matching Origin header", () => {
    const request = makeRequest({ origin: "https://portfolio.example" });
    expect(isTrustedSiteRequest(request, siteUrl)).toBe(true);
  });

  it("accepts matching Referer header", () => {
    const request = makeRequest({
      referer: "https://portfolio.example/contact",
    });
    expect(isTrustedSiteRequest(request, siteUrl)).toBe(true);
  });

  it("rejects foreign origins", () => {
    const request = makeRequest({ origin: "https://evil.example" });
    expect(isTrustedSiteRequest(request, siteUrl)).toBe(false);
  });

  it("rejects missing origin/referer when production enforcement is enabled", () => {
    const request = makeRequest({});
    expect(
      isTrustedSiteRequest(request, siteUrl, {
        requireOriginInProduction: true,
      }),
    ).toBe(false);
  });
});
