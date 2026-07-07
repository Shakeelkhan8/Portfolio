import { describe, expect, it } from "vitest";
import {
  sanitizeCssColor,
  sanitizeCustomCss,
  sanitizeRichHtml,
} from "@/lib/security/sanitize";

describe("sanitizeRichHtml", () => {
  it("preserves safe article markup", () => {
    const html = "<h2>Title</h2><p>Hello <strong>world</strong>.</p>";
    expect(sanitizeRichHtml(html)).toContain("<h2>Title</h2>");
    expect(sanitizeRichHtml(html)).toContain("<strong>world</strong>");
  });

  it("removes script tags and inline event handlers", () => {
    const html =
      '<p onclick="alert(1)">Hi</p><script>alert("xss")</script><img src=x onerror=alert(1) />';
    const sanitized = sanitizeRichHtml(html);

    expect(sanitized).not.toContain("<script");
    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("onerror");
  });

  it("adds rel noopener noreferrer to links", () => {
    const html = '<a href="https://example.com">Example</a>';
    expect(sanitizeRichHtml(html)).toContain('rel="noopener noreferrer"');
  });

  it("blocks javascript: URLs", () => {
    const html = '<a href="javascript:alert(1)">Bad link</a>';
    const sanitized = sanitizeRichHtml(html);
    expect(sanitized).not.toContain("javascript:");
  });
});

describe("sanitizeCustomCss", () => {
  it("removes style/script breakout attempts", () => {
    const css = "body { color: red; } </style><script>alert(1)</script>";
    const sanitized = sanitizeCustomCss(css);

    expect(sanitized).not.toContain("</style>");
    expect(sanitized).not.toContain("<script");
  });

  it("removes @import and expression()", () => {
    const css = "@import url('https://evil.test/x.css'); width: expression(alert(1));";
    const sanitized = sanitizeCustomCss(css);

    expect(sanitized).not.toContain("@import");
    expect(sanitized).not.toContain("expression(");
  });
});

describe("sanitizeCssColor", () => {
  it("accepts valid hex colors", () => {
    expect(sanitizeCssColor("#2563eb", "#000000")).toBe("#2563eb");
  });

  it("rejects invalid values", () => {
    expect(sanitizeCssColor("red; } body { display:none", "#000000")).toBe(
      "#000000",
    );
  });
});
