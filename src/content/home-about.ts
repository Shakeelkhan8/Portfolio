/**
 * The home page's About section and the hero's proof line. Every sentence
 * is the user's own account, approved on 2026-11-19, or comes from the
 * verified CV: the financial engine, tenant isolation and integrations
 * (Elityx), real-time pipelines and newsroom tools (HUM Network), and
 * mentoring four developers. Mobile apps and security audits are the
 * user's own report. tests/unit/content-claims.test.ts scans this file.
 */

export type HomeStat = {
  value: string;
  label: string;
};

/**
 * The ruled line along the bottom of the hero. "5+ years" counts from the
 * first internship (Jan 2021); full-time work started Oct 2022. The user
 * chose it on 2026-11-23 knowing that (see content-claims.test.ts).
 */
export const heroStats: HomeStat[] = [
  { value: "5+ years", label: "practical delivery" },
  { value: "Full stack", label: "database to deployment" },
  { value: "In production", label: "real users, real payments" },
];

export const homeAbout = {
  eyebrow: "About me",
  headline: ["Careful systems.", "Dependable delivery."],
  paragraphs: [
    "I build and run digital products across full stack web development, SaaS platforms, payments and integrations, mobile apps, DevOps and live broadcast systems.",
    "Since 2021 my work has grown from hands-on development into owning core systems end to end: the financial engine of a multi-company logistics SaaS, its tenant isolation and integrations, and real-time data pipelines and newsroom tools for live TV. I've also run security audits and mentored the developers who build on my code.",
    "I stay involved from planning and architecture through deployment, monitoring and steady improvement, and I write decisions down so the next engineer can carry on.",
  ],
  highlights: [
    // Matches the hero's "5+ years" (2026-11-23).
    { value: "5+ years", label: "Practical delivery" },
    { value: "Multidisciplinary", label: "Web, SaaS, mobile, DevOps, broadcast" },
    { value: "Full cycle", label: "Plan, build, deploy, support" },
  ] satisfies HomeStat[],
} as const;
