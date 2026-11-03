"use client";

import { useActionState } from "react";
import {
  deleteCustomScriptAction,
  refreshPublicCacheAction,
  upsertAnalyticsSettingsAction,
  upsertCustomScriptAction,
  upsertGitHubSettingsAction,
  upsertSeoDefaultsAction,
  upsertSiteSettingsAction,
  upsertThemeSettingsAction,
} from "@/lib/admin/actions/settings";
import { DeleteItemButton } from "@/components/admin/shared/delete-item-button";
import { FormMessage } from "@/components/admin/shared/form-message";
import { MediaSelect } from "@/components/admin/shared/media-select";
import { SubmitButton } from "@/components/admin/shared/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminSettingsData } from "@/lib/db/queries/settings";
import type { MediaFileRecord } from "@/types/cms";

type SettingsManagerProps = {
  settings: AdminSettingsData;
  mediaFiles: MediaFileRecord[];
};

export function SettingsManager({ settings, mediaFiles }: SettingsManagerProps) {
  const [siteState, saveSite] = useActionState(upsertSiteSettingsAction, {});
  const [seoState, saveSeo] = useActionState(upsertSeoDefaultsAction, {});
  const [themeState, saveTheme] = useActionState(upsertThemeSettingsAction, {});
  const [analyticsState, saveAnalytics] = useActionState(
    upsertAnalyticsSettingsAction,
    {},
  );
  const [githubState, saveGitHub] = useActionState(upsertGitHubSettingsAction, {});
  const [scriptState, saveScript] = useActionState(upsertCustomScriptAction, {});
  const [cacheState, refreshCache] = useActionState(refreshPublicCacheAction, {});

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">General</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Core site identity, contact details, and availability messaging.
        </p>
        <form action={saveSite} className="space-y-4">
          <input type="hidden" name="id" value={settings.site.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site name</Label>
              <Input id="siteName" name="siteName" defaultValue={settings.site.siteName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Legal name</Label>
              <Input id="legalName" name="legalName" defaultValue={settings.site.legalName} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={settings.site.tagline} required />
              <p className="text-xs text-muted-foreground">
                Public role title in the hero and resume header. Keep this aligned with your featured Experience role.
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} defaultValue={settings.site.description} required />
              <p className="text-xs text-muted-foreground">
                Shown in the homepage hero below your tagline. Lead with one concrete proof line, not a repeat of your job title.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={settings.site.email} required />
              <p className="text-xs text-muted-foreground">
                Prefer a custom-domain inbox (e.g. hello@yourdomain.com) for public pages. Update Social Links → Email too so footer/header stay in sync. Optional env override: CONTACT_EMAIL for form delivery only.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={settings.site.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={settings.site.location} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={settings.site.city} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue={settings.site.timezone} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of experience</Label>
              <Input id="yearsOfExperience" name="yearsOfExperience" type="number" min={0} defaultValue={settings.site.yearsOfExperience} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUsername">GitHub username</Label>
              <Input id="githubUsername" name="githubUsername" defaultValue={settings.site.githubUsername} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availabilityStatus">Availability status</Label>
              <select id="availabilityStatus" name="availabilityStatus" defaultValue={settings.site.availabilityStatus} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="available">Available</option>
                <option value="limited">Limited</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="availabilityMessage">Availability message</Label>
              <Input id="availabilityMessage" name="availabilityMessage" defaultValue={settings.site.availabilityMessage} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="responseTimeText">Response time text</Label>
              <Input id="responseTimeText" name="responseTimeText" defaultValue={settings.site.responseTimeText} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="copyrightText">Copyright text</Label>
              <Input id="copyrightText" name="copyrightText" defaultValue={settings.site.copyrightText} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="resumeSummary">Resume summary</Label>
              <Textarea id="resumeSummary" name="resumeSummary" rows={4} defaultValue={settings.site.resumeSummary} />
              <p className="text-xs text-muted-foreground">
                Start with the public title from the Tagline (e.g. Laravel Backend Developer).
              </p>
            </div>
            <div className="space-y-2 md:col-span-2 border-t border-border pt-4">
              <p className="text-sm font-medium">Maintenance mode</p>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="maintenanceEnabled" defaultChecked={settings.site.maintenanceEnabled} />
                Enable maintenance mode (public visitors receive HTTP 503)
              </label>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="maintenanceMessage">Maintenance message</Label>
              <Textarea id="maintenanceMessage" name="maintenanceMessage" rows={3} defaultValue={settings.site.maintenanceMessage} />
            </div>
          </div>
          <FormMessage error={siteState.error} success={siteState.success} />
          <SubmitButton label="Save general settings" />
        </form>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">SEO defaults</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Global metadata used by pages that do not override title, description, or robots.
        </p>
        <form action={saveSeo} className="space-y-4">
          <input type="hidden" name="id" value={settings.seo.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="defaultTitle">Default title</Label>
              <Input id="defaultTitle" name="defaultTitle" defaultValue={settings.seo.defaultTitle} required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="defaultDescription">Default description</Label>
              <Textarea id="defaultDescription" name="defaultDescription" rows={3} defaultValue={settings.seo.defaultDescription} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultRobots">Default robots</Label>
              <Input id="defaultRobots" name="defaultRobots" defaultValue={settings.seo.defaultRobots} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterCardType">Twitter card</Label>
              <select id="twitterCardType" name="twitterCardType" defaultValue={settings.seo.twitterCardType} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <MediaSelect
                id="defaultOgImageId"
                name="defaultOgImageId"
                label="Default Open Graph image"
                mediaFiles={mediaFiles}
                value={settings.seo.defaultOgImageId ?? ""}
              />
            </div>
          </div>
          <FormMessage error={seoState.error} success={seoState.success} />
          <SubmitButton label="Save SEO defaults" />
        </form>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">Theme</h2>
        <form action={saveTheme} className="space-y-4">
          <input type="hidden" name="id" value={settings.theme.id} />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary color</Label>
              <Input id="primaryColor" name="primaryColor" defaultValue={settings.theme.primaryColor} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent color</Label>
              <Input id="accentColor" name="accentColor" defaultValue={settings.theme.accentColor ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background color</Label>
              <Input id="backgroundColor" name="backgroundColor" defaultValue={settings.theme.backgroundColor ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foregroundColor">Foreground color</Label>
              <Input id="foregroundColor" name="foregroundColor" defaultValue={settings.theme.foregroundColor ?? ""} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="customCss">Custom CSS</Label>
              <Textarea id="customCss" name="customCss" rows={5} defaultValue={settings.theme.customCss ?? ""} />
            </div>
          </div>
          <input type="hidden" name="fontHeading" value={settings.theme.fontHeading} />
          <input type="hidden" name="fontBody" value={settings.theme.fontBody} />
          <input type="hidden" name="fontMono" value={settings.theme.fontMono} />
          <FormMessage error={themeState.error} success={themeState.success} />
          <SubmitButton label="Save theme settings" />
        </form>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">Analytics</h2>
        <form action={saveAnalytics} className="space-y-4">
          <input type="hidden" name="id" value={settings.analytics.id} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="plausibleEnabled" defaultChecked={settings.analytics.plausibleEnabled} />
            Enable Plausible Analytics
          </label>
          <div className="space-y-2">
            <Label htmlFor="plausibleDomain">Plausible domain</Label>
            <Input id="plausibleDomain" name="plausibleDomain" defaultValue={settings.analytics.plausibleDomain ?? ""} placeholder="example.com" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="ga4Enabled" defaultChecked={settings.analytics.ga4Enabled} />
            Enable Google Analytics 4
          </label>
          <div className="space-y-2">
            <Label htmlFor="ga4MeasurementId">GA4 measurement ID</Label>
            <Input id="ga4MeasurementId" name="ga4MeasurementId" defaultValue={settings.analytics.ga4MeasurementId ?? ""} placeholder="G-XXXXXXXXXX" />
          </div>
          <FormMessage error={analyticsState.error} success={analyticsState.success} />
          <SubmitButton label="Save analytics settings" />
        </form>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">GitHub integration</h2>
        <form action={saveGitHub} className="space-y-4">
          <input type="hidden" name="id" value={settings.github.id} />
          <div className="space-y-2">
            <Label htmlFor="username">GitHub username</Label>
            <Input id="username" name="username" defaultValue={settings.github.username} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="showLiveStats" defaultChecked={settings.github.showLiveStats} />
            Show live GitHub stats on Open Source page
          </label>
          <FormMessage error={githubState.error} success={githubState.success} />
          <SubmitButton label="Save GitHub settings" />
        </form>
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">Custom scripts</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Inject raw JavaScript snippets in the document head or end of body. Use only trusted code.
        </p>
        <form action={saveScript} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scriptName">Name</Label>
              <Input id="scriptName" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placement">Placement</Label>
              <select id="placement" name="placement" defaultValue="body_end" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="head">Head</option>
                <option value="body_end">Body end</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="scriptContent">Script content</Label>
              <Textarea id="scriptContent" name="scriptContent" rows={6} required />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="enabled" defaultChecked />
            Enabled
          </label>
          <FormMessage error={scriptState.error} success={scriptState.success} />
          <SubmitButton label="Add custom script" />
        </form>

        {settings.scripts.length ? (
          <ul className="mt-6 space-y-3">
            {settings.scripts.map((script) => (
              <li key={script.id} className="rounded-lg border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{script.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {script.placement} · {script.enabled ? "enabled" : "disabled"}
                    </p>
                  </div>
                  <DeleteItemButton
                    id={script.id}
                    label="Delete script"
                    action={deleteCustomScriptAction}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-xl border border-border p-6">
        <h2 className="mb-1 text-lg font-semibold">Public cache</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Edits made here refresh the pages they affect. Use this after content
          was changed outside the admin panel, for example by the content sync
          script.
        </p>
        <form action={refreshCache} className="space-y-4">
          <FormMessage error={cacheState.error} success={cacheState.success} />
          <SubmitButton label="Refresh public pages" />
        </form>
      </section>
    </div>
  );
}
