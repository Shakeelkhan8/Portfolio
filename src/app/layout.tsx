import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { PlausibleAnalytics } from "@/components/analytics/plausible-analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultMetadata, fontVariables } from "@/config/fonts";
import {
  getPersonSchema,
  getProfilePageSchema,
  getWebSiteSchema,
} from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", fontVariables)}>
      <body className="min-h-full flex flex-col">
        <JsonLd
          data={[getPersonSchema(), getWebSiteSchema(), getProfilePageSchema()]}
        />
        <AppProviders>{children}</AppProviders>
        <PlausibleAnalytics />
      </body>
    </html>
  );
}
