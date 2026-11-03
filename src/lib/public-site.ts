import type {
  PrivateSiteField,
  PublicSiteConfig,
  SiteConfig,
} from "@/types/cms";

export const PRIVATE_SITE_FIELDS: readonly PrivateSiteField[] = [
  "phone",
  "legalName",
  "location",
  "city",
  "timezone",
];

/**
 * Drops the personal fields (phone, legal name, location, time zone) before
 * site settings cross into client components. Server components that render
 * them on purpose, such as the resume, keep using the full `SiteConfig`.
 */
export function toPublicSiteConfig(site: SiteConfig): PublicSiteConfig {
  const copy: Partial<SiteConfig> = { ...site };
  for (const field of PRIVATE_SITE_FIELDS) {
    delete copy[field];
  }
  return copy as PublicSiteConfig;
}
