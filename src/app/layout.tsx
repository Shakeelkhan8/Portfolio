import type { Metadata } from "next";
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
      <body className="min-h-full flex flex-col">
        <RootJsonLd />
        <AppProviders>{children}</AppProviders>
        <SiteAnalytics />
        <CustomScripts />
      </body>
    </html>
  );
}
