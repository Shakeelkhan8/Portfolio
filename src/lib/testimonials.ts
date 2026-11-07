/**
 * Where a testimonial was verified, read from its company line.
 *
 * The CMS has no "source" column; verified reviews carry it in the company
 * text, e.g. "Client, Sep 2025 (verified on Upwork)". Splitting it out lets
 * the page show a proper "Verified on Upwork" badge, linked to the profile
 * where the review can be checked, without a schema change. Text without a
 * "(verified on X)" suffix is returned unchanged with no source.
 */
export function parseTestimonialSource(company: string | null | undefined): {
  company: string | null;
  verifiedOn: string | null;
} {
  const text = company?.trim() ?? "";
  const match = /\s*\(verified on ([^)]+)\)\s*$/i.exec(text);
  if (!match) return { company: text || null, verifiedOn: null };

  const rest = text.slice(0, match.index).trim();
  return { company: rest || null, verifiedOn: match[1]!.trim() };
}
