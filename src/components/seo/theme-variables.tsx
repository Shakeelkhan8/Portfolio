import { getThemeSettings } from "@/lib/db/queries/settings";

export async function ThemeVariables() {
  const theme = await getThemeSettings();

  const css = `
    :root {
      --primary: ${theme.primaryColor};
      --ring: ${theme.primaryColor};
      --sidebar-primary: ${theme.primaryColor};
      --sidebar-ring: ${theme.primaryColor};
      --chart-1: ${theme.primaryColor};
      ${theme.accentColor ? `--accent-muted: color-mix(in srgb, ${theme.accentColor} 12%, transparent);` : ""}
      ${theme.backgroundColor ? `--background: ${theme.backgroundColor};` : ""}
      ${theme.foregroundColor ? `--foreground: ${theme.foregroundColor};` : ""}
    }
    ${theme.customCss ?? ""}
  `.trim();

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
