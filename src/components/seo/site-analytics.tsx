import Script from "next/script";
import { getAnalyticsSettings } from "@/lib/db/queries/settings";
import { getPlausibleDomain } from "@/lib/monitoring";

export async function SiteAnalytics() {
  const analytics = await getAnalyticsSettings();
  const envPlausibleDomain = getPlausibleDomain();
  const plausibleDomain =
    analytics.plausibleEnabled && analytics.plausibleDomain
      ? analytics.plausibleDomain
      : envPlausibleDomain;

  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      {analytics.ga4Enabled && analytics.ga4MeasurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4MeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics.ga4MeasurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
    </>
  );
}
