import Script from "next/script";
import { getPlausibleDomain } from "@/lib/monitoring";

export function PlausibleAnalytics() {
  const domain = getPlausibleDomain();

  if (!domain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
