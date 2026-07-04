import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { Prose } from "@/components/typography/prose";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for this portfolio website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
      />
      <Section spacing="sm" className="border-t border-border pt-0">
        <Prose>
          <h2>Overview</h2>
          <p>
            This privacy policy explains how {siteConfig.name} (&quot;I&quot;,
            &quot;me&quot;) handles information when you visit this portfolio
            website at {siteConfig.url}.
          </p>

          <h2>Information I Collect</h2>
          <p>
            If you use the contact form, I collect your name, email address,
            and message content solely to respond to your inquiry. I do not sell
            or share this information with third parties.
          </p>

          <h2>Contact Form</h2>
          <p>
            Contact form submissions are processed via Resend email delivery
            service. Messages are sent directly to my email inbox and are not
            stored in a database.
          </p>

          <h2>Analytics</h2>
          <p>
            Analytics may be added in a future update (Plausible Analytics).
            If enabled, analytics will be privacy-focused and cookieless. This
            page will be updated accordingly.
          </p>

          <h2>Cookies</h2>
          <p>
            This site uses minimal local storage for theme preference (light/dark
            mode). No tracking cookies are used at this time.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </Prose>
      </Section>
    </>
  );
}
