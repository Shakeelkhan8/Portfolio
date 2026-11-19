/**
 * WhatsApp click-to-chat link from the CMS phone number.
 *
 * The phone number itself stays private (src/lib/public-site.ts strips it
 * from everything sent to the browser). The user chose on 2026-11-19 to
 * publish a WhatsApp link, which necessarily contains the number, so only
 * this link is derived on the server and passed to pages: the raw `phone`
 * field never reaches the HTML.
 */
export function getWhatsAppHref(phone: string | null | undefined): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  // E.164 numbers have 8 to 15 digits; anything shorter isn't dialable.
  if (digits.length < 8 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}
