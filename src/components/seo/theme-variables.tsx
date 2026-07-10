import { getThemeSettings } from "@/lib/db/queries/settings";
import { sanitizeCustomCss } from "@/lib/security/sanitize";

/**
 * Public site is dark-only. CMS brand color fields are not applied to the
 * frontend palette (cinematic tokens live in globals.css). Custom CSS from
 * settings is still injected so advanced overrides remain available.
 */
export async function ThemeVariables() {
  const theme = await getThemeSettings();
  const customCss = sanitizeCustomCss(theme.customCss);

  if (!customCss) {
    return null;
  }

  return <style dangerouslySetInnerHTML={{ __html: customCss }} />;
}
