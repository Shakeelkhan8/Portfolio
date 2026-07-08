import { describe, expect, it } from "vitest";
import {
  getMailtoHref,
  getPublicEmailLabel,
  isConsumerMailbox,
} from "@/lib/contact/email-display";

describe("email display helpers", () => {
  it("builds mailto hrefs", () => {
    expect(getMailtoHref("hello@example.com")).toBe("mailto:hello@example.com");
  });

  it("detects consumer mailbox hosts", () => {
    expect(isConsumerMailbox("shakeelkhan4147@gmail.com")).toBe(true);
    expect(isConsumerMailbox("hello@shakeelkhan.dev")).toBe(false);
  });

  it("hides consumer addresses behind a neutral CTA label", () => {
    expect(getPublicEmailLabel("shakeelkhan4147@gmail.com")).toBe("Email me");
    expect(getPublicEmailLabel("hello@shakeelkhan.dev")).toBe(
      "hello@shakeelkhan.dev",
    );
    expect(
      getPublicEmailLabel("shakeelkhan4147@gmail.com", { preferAddress: true }),
    ).toBe("shakeelkhan4147@gmail.com");
  });
});
