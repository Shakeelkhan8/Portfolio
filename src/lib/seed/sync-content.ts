import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSeedPayload, getSkillCategorySlug } from "@/lib/seed/content-data";

/**
 * Brings the live CMS content in line with the seed (src/content, src/config)
 * without a destructive re-seed.
 *
 * The production seed runs once, so edits to the seed never reach a database
 * that was seeded earlier. This syncs only the content that states who I am
 * and what I offer: site tagline and summary, SEO defaults, the home hero,
 * expertise, About, achievements, social links, services, testimonials,
 * skills, experience and the seeded projects. Articles, pages, media, theme,
 * navigation menus, messages and admin-created projects are not touched.
 *
 * Each table has a scope (which rows the sync owns) and a natural key. A seed
 * row whose key matches a live row keeps that row's id, so anything attached
 * to it (a project's gallery, OG image, categories) survives. Rows in scope
 * that are not in the seed are deleted. Running it twice is a no-op.
 *
 * Restore uses the same reconcile with the backup's rows as the target.
 * Public pages cache CMS data with no expiry, so nothing visitors see changes
 * until "Refresh public pages" runs in Admin → Settings.
 */

type Row = Record<string, unknown>;
type Client = SupabaseClient;

type Scope = {
  table: string;
  /** Natural key used to match a seed row to a live row. */
  key: (row: Row) => string;
  /** Columns the seed owns; others on a matched row are kept. */
  compare: string[];
};

export type Snapshot = Record<string, Row[]>;

export type TablePlan = {
  table: string;
  inserts: Row[];
  updates: Array<{ row: Row; changed: string[] }>;
  deletes: Row[];
  /** Full target rows (ids resolved), written with upsert on id. */
  target: Row[];
};

const byOrder = (row: Row) => String(row.display_order);

const childKey = (parent: string) => (row: Row) =>
  `${String(row[parent])}:${byOrder(row)}`;

const PROJECT_CHILD_TABLES = [
  "project_tags",
  "project_technologies",
  "project_links",
  "project_metrics",
  "project_challenges",
  "project_decisions",
  "project_results",
  "project_lessons",
  "project_future_improvements",
] as const;

/** Parents before children: upserts run in this order, deletes in reverse. */
export const SCOPES: Scope[] = [
  {
    table: "site_settings",
    key: () => "site",
    compare: [
      "tagline",
      "description",
      "availability_message",
      "resume_summary",
      "years_of_experience",
    ],
  },
  {
    table: "seo_defaults",
    key: () => "seo",
    compare: ["default_title", "default_description"],
  },
  {
    table: "cta_sections",
    key: (row) => String(row.section_key),
    compare: [
      "title",
      "description",
      "primary_label",
      "primary_href",
      "secondary_label",
      "secondary_href",
    ],
  },
  {
    table: "expertise_items",
    key: (row) => String(row.title),
    compare: ["title", "display_order"],
  },
  {
    table: "about_paragraphs",
    key: (row) => String(row.content),
    compare: ["content", "display_order"],
  },
  {
    table: "achievements",
    key: (row) => String(row.text),
    compare: ["text", "featured", "display_order"],
  },
  {
    table: "social_links",
    key: (row) => String(row.platform),
    compare: ["platform", "label", "url", "icon", "display_order"],
  },
  {
    table: "navigation_items",
    key: (row) => String(row.title),
    compare: ["nav_group", "title", "href", "external", "display_order"],
  },
  {
    table: "services",
    key: (row) => String(row.title),
    compare: ["title", "description", "icon", "display_order", "visible"],
  },
  {
    table: "testimonials",
    key: (row) => String(row.author_name),
    compare: [
      "author_name",
      "author_role",
      "author_company",
      "content",
      "featured",
      "display_order",
      "visible",
    ],
  },
  {
    table: "skill_categories",
    key: (row) => String(row.slug),
    compare: ["name", "slug", "display_order"],
  },
  {
    table: "skills",
    key: (row) => `${String(row.category_id)}:${String(row.name)}`,
    compare: ["category_id", "name", "display_order"],
  },
  {
    table: "experiences",
    key: (row) => String(row.legacy_id),
    compare: [
      "legacy_id",
      "company",
      "role",
      "location",
      "start_date",
      "end_date",
      "featured",
      "display_order",
    ],
  },
  {
    table: "experience_highlights",
    key: childKey("experience_id"),
    compare: ["experience_id", "text", "display_order"],
  },
  {
    table: "projects",
    key: (row) => String(row.slug),
    compare: [
      "slug",
      "title",
      "summary",
      "problem",
      "role",
      "context",
      "overview",
      "architecture_text",
      "status",
      "featured",
      "display_order",
    ],
  },
  ...PROJECT_CHILD_TABLES.map((table) => ({
    table,
    key: childKey("project_id"),
    compare: [
      "project_id",
      "tag",
      "technology",
      "label",
      "href",
      "value",
      "text",
      "decision",
      "rationale",
      "tradeoff",
      "display_order",
    ],
  })),
  {
    table: "project_architecture_diagrams",
    key: (row) => String(row.project_id),
    compare: ["project_id", "title", "nodes_json", "edges_json"],
  },
];

const scopeFor = (table: string) => {
  const scope = SCOPES.find((item) => item.table === table);
  if (!scope) throw new Error(`No sync scope for ${table}`);
  return scope;
};

/** jsonb comes back with its keys reordered, so compare with sorted keys. */
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Row)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, canonical(item)]),
    );
  }
  return value ?? null;
}

function same(a: unknown, b: unknown) {
  return JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
}

/**
 * Diff one table. `desired` rows carry no id unless they come from a backup;
 * a live row with the same natural key lends its id and unowned columns.
 */
export function planTable(
  table: string,
  current: Row[],
  desired: Row[],
  options: { matchById?: boolean } = {},
): TablePlan {
  const scope = scopeFor(table);
  const keyOf = options.matchById ? (row: Row) => String(row.id) : scope.key;
  const live = new Map(current.map((row) => [keyOf(row), row]));
  const kept = new Set<string>();
  const plan: TablePlan = {
    table,
    inserts: [],
    updates: [],
    deletes: [],
    target: [],
  };

  for (const want of desired) {
    const match = live.get(keyOf(want));
    if (!match) {
      const row = { ...want, id: want.id ?? randomUUID() };
      plan.inserts.push(row);
      plan.target.push(row);
      continue;
    }
    kept.add(String(match.id));
    // A backup row is restored exactly; a seed row keeps unowned live columns.
    const row = options.matchById
      ? { ...want }
      : { ...match, ...want, id: match.id };
    const columns = options.matchById ? Object.keys(want) : scope.compare;
    const changed = columns.filter(
      (column) => column in want && !same(match[column], want[column]),
    );
    if (changed.length) plan.updates.push({ row, changed });
    plan.target.push(row);
  }

  plan.deletes = current.filter((row) => !kept.has(String(row.id)));
  return plan;
}

async function select(
  supabase: Client,
  table: string,
  filter?: { column: string; op: "eq" | "in"; value: unknown },
): Promise<Row[]> {
  if (filter?.op === "in" && (filter.value as unknown[]).length === 0) {
    return [];
  }
  let query = supabase.from(table).select("*");
  if (filter?.op === "eq") query = query.eq(filter.column, filter.value);
  if (filter?.op === "in")
    query = query.in(filter.column, filter.value as unknown[]);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to read ${table}: ${error.message}`);
  return (data ?? []) as Row[];
}

/** Reads every row the sync owns. This is also the backup. */
export async function readSnapshot(supabase: Client): Promise<Snapshot> {
  const seedSlugs = getSeedPayload().projects.map((project) => project.slug);
  const snapshot: Snapshot = {
    site_settings: await select(supabase, "site_settings"),
    seo_defaults: await select(supabase, "seo_defaults"),
    cta_sections: await select(supabase, "cta_sections", {
      column: "section_key",
      op: "eq",
      value: "home_hero",
    }),
    expertise_items: await select(supabase, "expertise_items"),
    about_paragraphs: await select(supabase, "about_paragraphs"),
    achievements: await select(supabase, "achievements"),
    social_links: await select(supabase, "social_links"),
    navigation_items: await select(supabase, "navigation_items", {
      column: "nav_group",
      op: "eq",
      value: "social",
    }),
    services: await select(supabase, "services"),
    testimonials: await select(supabase, "testimonials"),
    skill_categories: await select(supabase, "skill_categories"),
    skills: await select(supabase, "skills"),
    experiences: await select(supabase, "experiences"),
    experience_highlights: await select(supabase, "experience_highlights"),
    projects: await select(supabase, "projects", {
      column: "slug",
      op: "in",
      value: seedSlugs,
    }),
  };
  const projectIds = snapshot.projects.map((row) => row.id);
  for (const table of [
    ...PROJECT_CHILD_TABLES,
    "project_architecture_diagrams",
  ]) {
    snapshot[table] = await select(supabase, table, {
      column: "project_id",
      op: "in",
      value: projectIds,
    });
  }
  return snapshot;
}

/** Target rows from the seed, with parent ids resolved against `current`. */
export function planFromSeed(current: Snapshot): TablePlan[] {
  const seed = getSeedPayload();
  const plans: TablePlan[] = [];
  const plan = (table: string, desired: Row[]) => {
    const result = planTable(table, current[table] ?? [], desired);
    plans.push(result);
    return result;
  };

  if (!current.site_settings?.length || !current.seo_defaults?.length) {
    throw new Error(
      "site_settings or seo_defaults is empty. Seed the database first (pnpm db:seed).",
    );
  }
  const site = seed.siteSettings;
  plan("site_settings", [
    {
      tagline: site.tagline,
      description: site.description,
      availability_message: site.availability_message,
      resume_summary: site.resume_summary,
      years_of_experience: site.years_of_experience,
    },
  ]);
  plan("seo_defaults", [
    {
      default_title: seed.seoDefaults.default_title,
      default_description: seed.seoDefaults.default_description,
    },
  ]);
  plan(
    "cta_sections",
    seed.ctaSections
      .filter((cta) => cta.section_key === "home_hero")
      .map((cta) => ({ ...cta })),
  );
  plan("expertise_items", seed.expertiseItems);
  plan("about_paragraphs", seed.aboutParagraphs);
  plan("achievements", seed.achievements);
  plan("social_links", seed.socialLinks);
  plan(
    "navigation_items",
    seed.navigation.filter((item) => item.nav_group === "social"),
  );
  plan("services", seed.services);
  plan("testimonials", [...seed.testimonials]);

  const categories = plan(
    "skill_categories",
    seed.skillGroups.map((group, index) => ({
      name: group.category,
      slug: getSkillCategorySlug(group.category),
      display_order: index,
    })),
  );
  const categoryId = new Map(
    categories.target.map((row) => [row.slug, row.id]),
  );
  plan(
    "skills",
    seed.skillGroups.flatMap((group) =>
      group.skills.map((name, index) => ({
        category_id: categoryId.get(getSkillCategorySlug(group.category)),
        name,
        display_order: index,
      })),
    ),
  );

  const experiences = plan(
    "experiences",
    seed.experience.map((entry) => ({
      legacy_id: entry.legacy_id,
      company: entry.company,
      role: entry.role,
      location: entry.location,
      start_date: entry.start_date,
      end_date: entry.end_date,
      featured: entry.featured,
      display_order: entry.display_order,
    })),
  );
  const experienceId = new Map(
    experiences.target.map((row) => [row.legacy_id, row.id]),
  );
  plan(
    "experience_highlights",
    seed.experience.flatMap((entry) =>
      entry.highlights.map((text, index) => ({
        experience_id: experienceId.get(entry.legacy_id),
        text,
        display_order: index,
      })),
    ),
  );

  const projects = plan(
    "projects",
    seed.projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      problem: project.problem,
      role: project.role,
      context: project.context,
      overview: project.overview,
      architecture_text: project.architecture_text,
      status: project.status,
      featured: project.featured,
      display_order: project.display_order,
    })),
  );
  // New projects need a publish date; live ones keep theirs.
  for (const row of projects.inserts)
    row.published_at = new Date().toISOString();
  const projectId = new Map(projects.target.map((row) => [row.slug, row.id]));
  const children = (pick: (project: (typeof seed.projects)[number]) => Row[]) =>
    seed.projects.flatMap((project) =>
      pick(project).map((row, index) => ({
        project_id: projectId.get(project.slug),
        ...row,
        display_order: index,
      })),
    );

  plan(
    "project_tags",
    children((p) => p.tags.map((tag) => ({ tag }))),
  );
  plan(
    "project_technologies",
    children((p) => p.stack.map((technology) => ({ technology }))),
  );
  plan(
    "project_links",
    children((p) =>
      p.links.map((link) => ({ label: link.label, href: link.href })),
    ),
  );
  plan(
    "project_metrics",
    children((p) =>
      p.metrics.map((metric) => ({ label: metric.label, value: metric.value })),
    ),
  );
  plan(
    "project_challenges",
    children((p) => p.challenges.map((text) => ({ text }))),
  );
  plan(
    "project_decisions",
    children((p) =>
      p.decisions.map((item) => ({
        decision: item.decision,
        rationale: item.rationale,
        tradeoff: item.tradeoff,
      })),
    ),
  );
  plan(
    "project_results",
    children((p) => p.results.map((text) => ({ text }))),
  );
  plan(
    "project_lessons",
    children((p) => p.lessons.map((text) => ({ text }))),
  );
  plan(
    "project_future_improvements",
    children((p) => p.futureImprovements.map((text) => ({ text }))),
  );
  plan(
    "project_architecture_diagrams",
    seed.projects
      .filter((project) => project.diagram)
      .map((project) => ({
        project_id: projectId.get(project.slug),
        title: project.diagram!.title,
        nodes_json: project.diagram!.nodes,
        edges_json: project.diagram!.edges,
      })),
  );

  return plans;
}

/** Target rows from a backup: every row back to exactly what it was. */
export function planFromBackup(
  current: Snapshot,
  backup: Snapshot,
): TablePlan[] {
  return SCOPES.map(({ table }) =>
    planTable(table, current[table] ?? [], backup[table] ?? [], {
      matchById: true,
    }),
  );
}

export function hasChanges(plans: TablePlan[]) {
  return plans.some(
    (plan) => plan.inserts.length || plan.updates.length || plan.deletes.length,
  );
}

const preview = (row: Row) => {
  const label =
    row.slug ??
    row.legacy_id ??
    row.title ??
    row.name ??
    row.author_name ??
    row.platform ??
    row.text ??
    row.content ??
    row.label ??
    row.id;
  const text = String(label);
  return text.length > 70 ? `${text.slice(0, 67)}...` : text;
};

export function describePlans(plans: TablePlan[]): string[] {
  const lines: string[] = [];
  for (const plan of plans) {
    const { inserts, updates, deletes } = plan;
    if (!inserts.length && !updates.length && !deletes.length) continue;
    lines.push(
      `${plan.table}: +${inserts.length} ~${updates.length} -${deletes.length}`,
    );
    for (const row of deletes) lines.push(`  - ${preview(row)}`);
    for (const { row, changed } of updates) {
      lines.push(`  ~ ${preview(row)} (${changed.join(", ")})`);
    }
    for (const row of inserts) lines.push(`  + ${preview(row)}`);
  }
  return lines.length
    ? lines
    : ["No changes: the live content already matches."];
}

/**
 * Deletes children-first, then upserts parents-first. Not atomic (PostgREST
 * has no multi-table transaction): if it stops halfway, the public pages are
 * still served from cache, and re-running converges on the same target.
 */
export async function applyPlans(supabase: Client, plans: TablePlan[]) {
  for (const plan of [...plans].reverse()) {
    const ids = plan.deletes.map((row) => row.id);
    if (!ids.length) continue;
    const { error } = await supabase.from(plan.table).delete().in("id", ids);
    if (error)
      throw new Error(`Failed to delete from ${plan.table}: ${error.message}`);
  }
  for (const plan of plans) {
    if (!plan.target.length) continue;
    const { error } = await supabase
      .from(plan.table)
      .upsert(plan.target, { onConflict: "id", defaultToNull: false });
    if (error)
      throw new Error(`Failed to write ${plan.table}: ${error.message}`);
  }
}
