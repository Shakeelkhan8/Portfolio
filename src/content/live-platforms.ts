/**
 * Live production websites the user worked on, shown as work cards on the
 * home page. Confirmed by the user: HUM News and HUM TV (2026-11-19) and the
 * HUM Network corporate site (2026-11-21), all at HUM Network (themes and plugins, live data feeds, the 2024
 * election results pages, the live stream page, integrations, performance and
 * production fixes). Worded as the user's contribution, not as building the
 * whole site. tests/unit/content-claims.test.ts scans this file.
 */

/** The layout sketched in the card's site frame; no third-party imagery is used. */
export type SiteLayout = "news" | "tv" | "corporate";

export type LivePlatform = {
  category: string;
  layout: SiteLayout;
  name: string;
  url: string;
  summary: string;
  tags: string[];
};

export const livePlatforms: LivePlatform[] = [
  {
    category: "High-traffic Urdu and English news platform",
    layout: "news",
    name: "HUM News",
    url: "https://humnews.pk/",
    summary:
      "I worked on WordPress development, maintenance, performance, integrations and production support for the live platform, including live data feeds and the 2024 general election results pages.",
    tags: ["WordPress", "PHP", "JavaScript", "REST APIs", "Performance"],
  },
  {
    category: "Drama and entertainment platform",
    layout: "tv",
    name: "HUM TV",
    url: "https://hum.tv/",
    summary:
      "I worked on WordPress development and maintenance for the platform: templates for dramas, shows and soundtracks, the live stream page, integrations and production support.",
    tags: ["WordPress", "PHP", "JavaScript", "Live streaming", "Performance"],
  },
  {
    category: "Corporate media network website",
    layout: "corporate",
    name: "HUM Network",
    url: "https://www.humnetwork.tv/",
    summary:
      "I worked on the corporate WordPress site: responsive templates, content updates and production support for the group's public presence.",
    tags: ["WordPress", "PHP", "Responsive web"],
  },
];
