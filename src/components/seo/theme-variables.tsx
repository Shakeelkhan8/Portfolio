import { getThemeSettings } from "@/lib/db/queries/settings";
import {
  sanitizeCssColor,
  sanitizeCustomCss,
} from "@/lib/security/sanitize";

export async function ThemeVariables() {
  const theme = await getThemeSettings();
  const primaryColor = sanitizeCssColor(theme.primaryColor, "#2563eb");
  const accentColor = theme.accentColor
    ? sanitizeCssColor(theme.accentColor, primaryColor)
    : null;
  const backgroundColor = theme.backgroundColor
    ? sanitizeCssColor(theme.backgroundColor, "#fafafa")
    : null;
  const foregroundColor = theme.foregroundColor
    ? sanitizeCssColor(theme.foregroundColor, "#171717")
    : null;
  const customCss = sanitizeCustomCss(theme.customCss);

  const css = `
    :root {
      --primary: ${primaryColor};
      --ring: ${primaryColor};
      --sidebar-primary: ${primaryColor};
      --sidebar-ring: ${primaryColor};
      --chart-1: ${primaryColor};
      ${accentColor ? `--accent-muted: color-mix(in srgb, ${accentColor} 12%, transparent);` : ""}
      ${backgroundColor ? `--background: ${backgroundColor};` : ""}
      ${foregroundColor ? `--foreground: ${foregroundColor};` : ""}
    }
    ${customCss}
  `.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
