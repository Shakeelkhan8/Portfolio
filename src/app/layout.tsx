import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { CustomScripts } from "@/components/seo/custom-scripts";
import { RootJsonLd } from "@/components/seo/root-json-ld";
import { SiteAnalytics } from "@/components/seo/site-analytics";
import { ThemeVariables } from "@/components/seo/theme-variables";
import { fontVariables } from "@/config/fonts";
import { buildDefaultMetadata, getMetadataContext } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#131210" },
  ],
  colorScheme: "light dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const ctx = await getMetadataContext();
  return buildDefaultMetadata(ctx);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("h-full", fontVariables)}
    >
      <head>
        <ThemeVariables />
      </head>
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-clip">
        <RootJsonLd />
        <AppProviders>{children}</AppProviders>
        <SiteAnalytics />
        <CustomScripts />
      </body>
    </html>
  );
}
