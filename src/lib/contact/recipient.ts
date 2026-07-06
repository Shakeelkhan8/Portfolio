import { siteConfig } from "@/config/site";
import { getContactEnv } from "@/lib/env";
import { getSiteConfig } from "@/lib/db/queries/site";

export async function resolveContactRecipientEmail() {
  const { contactEmail } = getContactEnv();

  if (contactEmail) {
    return contactEmail;
  }

  try {
    const site = await getSiteConfig();
    return site.email;
  } catch {
    return siteConfig.email;
  }
}
