import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { getSeedPayload } from "@/lib/seed/content-data";
import {
  decideSync,
  hasChanges,
  planFromBackup,
  seedChanged,
  planFromSeed,
  SCOPES,
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
  const oldSeed = getSeedPayload();
  /** A database the old seed was synced into. */
  const synced = () => afterApply(liveSnapshot(), planFromSeed(liveSnapshot(), oldSeed));
  /** The next commit adds one skill. */
  const newSeed = () => {
    const seed = structuredClone(oldSeed);
    seed.skillGroups[0].skills.push("Rust");
    return seed;
  };
  const decide = (db: Snapshot, next: typeof oldSeed) =>
    decideSync(planFromSeed(db, next), {
      plans: planFromSeed(db, oldSeed),
      seedChanged: seedChanged(db, oldSeed, next),
    });
  const editInAdmin = (db: Snapshot) => {
    const edited = structuredClone(db);
    edited.skills[0] = { ...edited.skills[0], name: "Edited in Admin" };
    return edited;
  };

  it("applies when the database still matches the previous seed", () => {
    expect(decide(synced(), newSeed())).toBe("apply");
  });

  it("blocks when an Admin edit would be overwritten", () => {
    expect(decide(editInAdmin(synced()), newSeed())).toBe("blocked");
  });

  it("leaves Admin edits alone when the commit didn't change the seed", () => {
    expect(decide(editInAdmin(synced()), oldSeed)).toBe("unchanged");
  });

  it("does nothing when the database already matches the new seed", () => {
    const db = afterApply(synced(), planFromSeed(synced(), newSeed()));
    expect(decide(db, newSeed())).toBe("noop");
  });

  it("blocks when an earlier sync never ran", () => {
    // The live database is still on the 2026-11-03 content.
    expect(decide(liveSnapshot(), newSeed())).toBe("blocked");
  });

  it("treats a re-export of the same content as unchanged", () => {
    // The seed stamps projects with the export time, so the JSON differs.
    const reExported = structuredClone(oldSeed);
    for (const project of reExported.projects) {
      project.published_at = "2030-01-01T00:00:00.000Z";
    }
    expect(JSON.stringify(reExported)).not.toBe(JSON.stringify(oldSeed));
    expect(seedChanged(synced(), oldSeed, reExported)).toBe(false);
    expect(decide(editInAdmin(synced()), reExported)).toBe("unchanged");
  });

  it("applies without a drift check after a person reviewed the dry run", () => {
    expect(decideSync(planFromSeed(editInAdmin(synced()), newSeed()), null)).toBe(
      "apply",
    );
  });
});
