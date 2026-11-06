import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppProviders } from "@/components/providers/app-providers";
import { CustomScripts } from "@/components/seo/custom-scripts";
import { RootJsonLd } from "@/components/seo/root-json-ld";
import { SiteAnalytics } from "@/components/seo/site-analytics";
import { ThemeVariables } from "@/components/seo/theme-variables";
import { fontVariables } from "@/config/fonts";
import {
  buildDefaultMetadata,
  getMetadataContext,
} from "@/lib/metadata";
import { cn } from "@/lib/utils";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0a09",
  colorScheme: "dark",
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
      className={cn("dark h-full", fontVariables)}
    >
      <head>
        <ThemeVariables />
      </head>
      <body className="flex min-h-full w-full max-w-full flex-col overflow-x-clip">
        <RootJsonLd />
        <AppProviders>{children}</AppProviders>
        <SiteAnalytics />
        <CustomScripts />
        {/*
          Real-user LCP, INP and CLS per route (Vercel Speed Insights); lab
          tools cannot measure INP. Its script is served by Vercel, so it is
          only rendered there (VERCEL is set on every Vercel build) and needs
          Speed Insights enabled for the project in the Vercel dashboard.
        */}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
