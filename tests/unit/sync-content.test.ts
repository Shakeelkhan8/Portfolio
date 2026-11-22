import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { getSeedPayload } from "@/lib/seed/content-data";
import { seedJson } from "../../scripts/seed-json";
import {
  decideSync,
  hasChanges,
  planFromBackup,
  seedChanged,
  planFromSeed,
  SCOPES,
  type SeedPayload,
  type Snapshot,
  type TablePlan,
} from "@/lib/seed/sync-content";

/** A database shaped like the live one on 2026-11-03 (an older seed). */
function liveSnapshot(): Snapshot {
  return {
    site_settings: [
      {
        id: "site-1",
        site_name: "Shakeel Khan",
        tagline: "Senior Backend Engineer",
        description: "Backend engineer with 5+ years of experience.",
        availability_message: "Open to full-time roles",
        resume_summary: "Backend Engineer with 5+ years of experience.",
        years_of_experience: 5,
        response_time_text: "Usually within 24–48 hours.",
      },
    ],
    seo_defaults: [
      {
        id: "seo-1",
        default_title: "Shakeel Khan | Senior Backend Engineer",
        default_description: "Senior backend engineer.",
        default_robots: "index, follow",
      },
    ],
    testimonials: [
      {
        id: "placeholder",
        author_name: "Engineering Lead",
        author_role: "Staff Engineer",
        author_company: "Enterprise SaaS",
        content:
          "Shakeel consistently delivers well-architected backend systems.",
        featured: true,
        display_order: 0,
        visible: true,
      },
    ],
    projects: [
      {
        id: "project-dispatch",
        slug: "dispatch-management-saas",
        title: "Dispatch Management SaaS",
        role: "Sole Backend Engineer — 80%+ system ownership",
        og_image_media_id: "media-1",
        published_at: "2026-03-07T00:00:00Z",
      },
    ],
    project_metrics: [
      {
        id: "metric-old",
        project_id: "project-dispatch",
        label: "Companies onboarded",
        value: "5",
        display_order: 0,
      },
    ],
  };
}

/** What the database holds after a plan is written: each scope's target. */
function afterApply(current: Snapshot, plans: TablePlan[]): Snapshot {
  const next: Snapshot = { ...current };
  for (const plan of plans) next[plan.table] = plan.target;
  return next;
}

const planFor = (plans: TablePlan[], table: string) =>
  plans.find((plan) => plan.table === table)!;

describe("content sync", () => {
  it("replaces the outdated live claims with the seed", () => {
    const plans = planFromSeed(liveSnapshot());

    const site = planFor(plans, "site_settings");
    expect(site.updates[0]?.row.tagline).toBe(siteConfig.title);
    expect(site.updates[0]?.row.response_time_text).toBe(
      "Within one working day.",
    );
    // Columns the sync doesn't own are kept.
    expect(site.target[0]?.site_name).toBe("Shakeel Khan");

    const testimonials = planFor(plans, "testimonials");
    expect(testimonials.deletes.map((row) => row.id)).toEqual(["placeholder"]);
    expect(testimonials.inserts.map((row) => row.author_name)).toEqual([
      "Hamza I.",
    ]);
  });

  it("updates a live project in place, keeping its id and OG image", () => {
    const plans = planFromSeed(liveSnapshot());
    const dispatch = planFor(plans, "projects").target.find(
      (row) => row.slug === "dispatch-management-saas",
    );

    expect(dispatch?.id).toBe("project-dispatch");
    expect(dispatch?.og_image_media_id).toBe("media-1");
    expect(dispatch?.published_at).toBe("2026-03-07T00:00:00Z");
    expect(String(dispatch?.role)).not.toMatch(/sole|80%/i);

    const metrics = planFor(plans, "project_metrics").target.filter(
      (row) => row.project_id === "project-dispatch",
    );
    expect(metrics.map((row) => row.value)).toEqual([
      "~63%",
      "58%",
      "Every deploy",
    ]);
  });

  it("is a no-op the second time", () => {
    const first = planFromSeed(liveSnapshot());
    const synced = afterApply(liveSnapshot(), first);

    expect(hasChanges(first)).toBe(true);
    expect(hasChanges(planFromSeed(synced))).toBe(false);
  });

  it("restores every scoped table from a backup", () => {
    const backup = liveSnapshot();
    const synced = afterApply(backup, planFromSeed(backup));
    const restored = afterApply(synced, planFromBackup(synced, backup));

    for (const { table } of SCOPES) {
      expect(restored[table] ?? []).toEqual(backup[table] ?? []);
    }
  });

  it("refuses to run against a database that was never seeded", () => {
    expect(() => planFromSeed({})).toThrow(/Seed the database first/);
  });
});

describe("unattended sync decision (drift check)", () => {
  /** Three seed versions: v1, then v2 adds a skill, then v3 adds another. */
  const v1 = getSeedPayload();
  const addSkill = (seed: SeedPayload, name: string) => {
    const next = structuredClone(seed);
    next.skillGroups[0].skills.push(name);
    return next;
  };
  const v2 = addSkill(v1, "Rust");
  const v3 = addSkill(v2, "Elixir");

  /** A seed as the workflow gets it: exported to JSON by an older commit. */
  const exported = (seed: SeedPayload) => JSON.parse(seedJson(seed)) as SeedPayload;
  const syncedTo = (seed: SeedPayload) =>
    afterApply(liveSnapshot(), planFromSeed(liveSnapshot(), seed));

  /**
   * The workflow's call: `next` is the deployed seed, `versions` the recent
   * seed versions newest first (versions[0] = the previous commit).
   */
  const decide = (db: Snapshot, next: SeedPayload, versions: SeedPayload[]) => {
    const baselines = versions.map(exported);
    return decideSync(planFromSeed(db, next), {
      versions: baselines.map((seed) => planFromSeed(db, seed)),
      seedChanged: seedChanged(db, baselines[0], next),
    });
  };
  const editInAdmin = (db: Snapshot) => {
    const edited = structuredClone(db);
    edited.skills[0] = { ...edited.skills[0], name: "Edited in Admin" };
    return edited;
  };

  it("applies when the database still matches the previous seed", () => {
    expect(decide(syncedTo(v1), v2, [v1])).toBe("apply");
  });

  it("catches up when an earlier sync was missed", () => {
    // v2's sync never ran, so the database is still on v1.
    expect(decide(syncedTo(v1), v3, [v2, v1])).toBe("apply");
  });

  it("catches up a missed sync even when this commit changed no content", () => {
    expect(decide(syncedTo(v1), v2, [v2, v1])).toBe("apply");
  });

  it("blocks when an Admin edit would be overwritten", () => {
    expect(decide(editInAdmin(syncedTo(v1)), v3, [v2, v1])).toBe("blocked");
  });

  it("leaves Admin edits alone when the commit didn't change the seed", () => {
    expect(decide(editInAdmin(syncedTo(v2)), v2, [v2, v1])).toBe("unchanged");
  });

  it("does nothing when the database already matches the new seed", () => {
    expect(decide(syncedTo(v2), v2, [v1])).toBe("noop");
  });

  it("blocks when the database matches none of the recent versions", () => {
    // The live database is still on the 2026-11-03 content.
    expect(decide(liveSnapshot(), v3, [v2, v1])).toBe("blocked");
  });

  it("treats a re-export of the same content as unchanged", () => {
    // The seed stamps projects with the export time, so the JSON differs.
    const reExported = structuredClone(v2);
    for (const project of reExported.projects) {
      project.published_at = "2030-01-01T00:00:00.000Z";
    }
    expect(JSON.stringify(reExported)).not.toBe(JSON.stringify(v2));
    expect(seedChanged(syncedTo(v2), v2, reExported)).toBe(false);
    expect(decide(editInAdmin(syncedTo(v2)), reExported, [v2])).toBe("unchanged");
  });

  it("keeps an unset owned field through the JSON export", () => {
    // JSON.stringify drops undefined keys. Seed rows like testimonials pass
    // straight through, so the sync would stop comparing that column and
    // miss an Admin edit to it.
    const seed = structuredClone(v1);
    (seed.testimonials[0] as Record<string, unknown>).author_company = undefined;
    const db = syncedTo(v1);
    expect(hasChanges(planFromSeed(db, seed))).toBe(true);
    expect(hasChanges(planFromSeed(db, exported(seed)))).toBe(true);
  });

  it("applies without a drift check after a person reviewed the dry run", () => {
    expect(decideSync(planFromSeed(editInAdmin(syncedTo(v1)), v2), null)).toBe(
      "apply",
    );
  });
});
