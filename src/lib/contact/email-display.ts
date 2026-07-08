/** Consumer mailbox providers that read as less senior on a portfolio. */
const CONSUMER_EMAIL_HOSTS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
]);

export function getMailtoHref(email: string): `mailto:${string}` {
  return `mailto:${email}`;
}

export function isConsumerMailbox(email: string): boolean {
  const host = email.split("@")[1]?.toLowerCase();
  return Boolean(host && CONSUMER_EMAIL_HOSTS.has(host));
}

/**
 * Label for public mailto actions. Prefer a neutral CTA when the address
 * is still on a consumer provider; show the address once a domain mailbox exists.
 */
export function getPublicEmailLabel(
  email: string,
  options?: { preferAddress?: boolean },
): string {
  if (options?.preferAddress || !isConsumerMailbox(email)) {
    return email;
  }
  return "Email me";
}
