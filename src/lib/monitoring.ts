export function getPlausibleDomain(): string | undefined {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim();
  return domain || undefined;
}
