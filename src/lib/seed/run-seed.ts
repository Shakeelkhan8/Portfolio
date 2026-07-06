import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSeedPayload,
  getSkillCategorySlug,
  SEED_META_KEY,
} from "@/lib/seed/content-data";

type ServiceClient = SupabaseClient;

export type SeedOptions = {
  adminEmail: string;
  adminPassword: string;
  force?: boolean;
};

export type SeedResult = {
  seeded: boolean;
  adminUserId?: string;
  message: string;
};

async function isSeedCompleted(supabase: ServiceClient) {
  const { data } = await supabase
    .from("app_meta")
    .select("value")
    .eq("key", SEED_META_KEY)
    .maybeSingle();

  return data?.value === "true";
}

async function ensureAdminUser(
  supabase: ServiceClient,
  adminEmail: string,
  adminPassword: string,
) {
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const existing = existingUsers.users.find(
    (user) => user.email?.toLowerCase() === adminEmail.toLowerCase(),
  );

  if (existing) {
    await supabase.from("admin_users").upsert(
      {
        user_id: existing.id,
        email: adminEmail,
      },
      { onConflict: "user_id" },
    );

    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (error || !data.user) {
    throw new Error(`Failed to create admin user: ${error?.message}`);
  }

  const { error: adminInsertError } = await supabase.from("admin_users").insert({
    user_id: data.user.id,
    email: adminEmail,
  });

  if (adminInsertError) {
    throw new Error(`Failed to register admin user: ${adminInsertError.message}`);
  }

  return data.user.id;
}

async function clearSeedData(supabase: ServiceClient) {
  const deleteAll = async (table: string, column = "id") => {
    const { error } = await supabase.from(table).delete().not(column, "is", null);
    if (error) {
      throw new Error(`Failed to clear ${table}: ${error.message}`);
    }
  };

  await deleteAll("project_architecture_diagrams");
  await deleteAll("project_future_improvements");
  await deleteAll("project_lessons");
  await deleteAll("project_results");
  await deleteAll("project_decisions");
  await deleteAll("project_challenges");
  await deleteAll("project_metrics");
  await deleteAll("project_links");
  await deleteAll("project_technologies");
  await deleteAll("project_tags");
  await deleteAll("project_gallery");
  await supabase.from("project_category_map").delete().not("project_id", "is", null);
  await deleteAll("projects");
  await deleteAll("project_categories");
  await deleteAll("experience_highlights");
  await deleteAll("experience_technologies");
  await deleteAll("experiences");
  await deleteAll("education_achievements");
  await deleteAll("educations");
  await deleteAll("skills");
  await deleteAll("skill_categories");
  await deleteAll("article_tags");
  await deleteAll("articles");
  await deleteAll("certifications");
  await deleteAll("testimonials");
  await deleteAll("services");
  await deleteAll("resume_versions");
  await deleteAll("curated_repos");
  await deleteAll("pages");
  await deleteAll("section_headers");
  await deleteAll("cta_sections");
  await deleteAll("philosophy_items");
  await deleteAll("expertise_items");
  await deleteAll("about_paragraphs");
  await deleteAll("languages");
  await deleteAll("achievements");
  await deleteAll("navigation_items");
  await deleteAll("social_links");
  await deleteAll("custom_scripts");
  await deleteAll("analytics_settings");
  await deleteAll("seo_defaults");
  await deleteAll("theme_settings");
  await deleteAll("site_settings");
  await deleteAll("github_settings");
  await deleteAll("audit_logs");
  await supabase.from("app_meta").delete().eq("key", SEED_META_KEY);
}

export async function runSeed(
  supabase: ServiceClient,
  options: SeedOptions,
): Promise<SeedResult> {
  if (!options.force && (await isSeedCompleted(supabase))) {
    return {
      seeded: false,
      message: "Seed already completed. Use --force to re-seed.",
    };
  }

  if (options.force) {
    await clearSeedData(supabase);
  }

  const payload = getSeedPayload();
  const adminUserId = await ensureAdminUser(
    supabase,
    options.adminEmail,
    options.adminPassword,
  );

  const { error: siteError } = await supabase
    .from("site_settings")
    .insert(payload.siteSettings);

  if (siteError) {
    throw new Error(`Failed to seed site settings: ${siteError.message}`);
  }

  const inserts = await Promise.all([
    supabase.from("theme_settings").insert(payload.themeSettings),
    supabase.from("seo_defaults").insert(payload.seoDefaults),
    supabase.from("analytics_settings").insert(payload.analyticsSettings),
    supabase.from("github_settings").insert(payload.githubSettings),
    supabase.from("philosophy_items").insert(payload.philosophyItems),
    supabase.from("expertise_items").insert(payload.expertiseItems),
    supabase.from("about_paragraphs").insert(payload.aboutParagraphs),
    supabase.from("languages").insert(payload.languages),
    supabase.from("achievements").insert(payload.achievements),
    supabase.from("navigation_items").insert(payload.navigation),
    supabase.from("social_links").insert(payload.socialLinks),
    supabase.from("section_headers").insert([...payload.sectionHeaders]),
    supabase.from("cta_sections").insert([...payload.ctaSections]),
    supabase.from("pages").insert({
      slug: payload.privacyPage.slug,
      title: payload.privacyPage.title,
      content_html: payload.privacyPage.content_html,
      status: payload.privacyPage.status,
      meta_title: payload.privacyPage.meta_title,
      meta_description: payload.privacyPage.meta_description,
      published_at: new Date().toISOString(),
    }),
  ]);

  for (const result of inserts) {
    if (result.error) {
      throw new Error(`Failed to seed content: ${result.error.message}`);
    }
  }

  for (const [index, group] of payload.skillGroups.entries()) {
    const { data: category, error: categoryError } = await supabase
      .from("skill_categories")
      .insert({
        name: group.category,
        slug: getSkillCategorySlug(group.category),
        display_order: index,
      })
      .select("id")
      .single();

    if (categoryError || !category) {
      throw new Error(`Failed to seed skill category: ${categoryError?.message}`);
    }

    const { error: skillsError } = await supabase.from("skills").insert(
      group.skills.map((skill, skillIndex) => ({
        category_id: category.id,
        name: skill,
        display_order: skillIndex,
      })),
    );

    if (skillsError) {
      throw new Error(`Failed to seed skills: ${skillsError.message}`);
    }
  }

  for (const entry of payload.experience) {
    const { data: experienceRow, error: experienceError } = await supabase
      .from("experiences")
      .insert({
        legacy_id: entry.legacy_id,
        company: entry.company,
        role: entry.role,
        location: entry.location,
        start_date: entry.start_date,
        end_date: entry.end_date,
        featured: entry.featured,
        display_order: entry.display_order,
      })
      .select("id")
      .single();

    if (experienceError || !experienceRow) {
      throw new Error(`Failed to seed experience: ${experienceError?.message}`);
    }

    const { error: highlightError } = await supabase
      .from("experience_highlights")
      .insert(
        entry.highlights.map((text, highlightIndex) => ({
          experience_id: experienceRow.id,
          text,
          display_order: highlightIndex,
        })),
      );

    if (highlightError) {
      throw new Error(`Failed to seed experience highlights: ${highlightError.message}`);
    }
  }

  for (const entry of payload.education) {
    const { error } = await supabase.from("educations").insert(entry);
    if (error) {
      throw new Error(`Failed to seed education: ${error.message}`);
    }
  }

  for (const project of payload.projects) {
    const { data: projectRow, error: projectError } = await supabase
      .from("projects")
      .insert({
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
        published_at: project.published_at,
      })
      .select("id")
      .single();

    if (projectError || !projectRow) {
      throw new Error(`Failed to seed project: ${projectError?.message}`);
    }

    const childInserts = await Promise.all([
      supabase.from("project_tags").insert(
        project.tags.map((tag, index) => ({
          project_id: projectRow.id,
          tag,
          display_order: index,
        })),
      ),
      supabase.from("project_technologies").insert(
        project.stack.map((technology, index) => ({
          project_id: projectRow.id,
          technology,
          display_order: index,
        })),
      ),
      supabase.from("project_links").insert(
        project.links.map((link, index) => ({
          project_id: projectRow.id,
          label: link.label,
          href: link.href,
          display_order: index,
        })),
      ),
      supabase.from("project_metrics").insert(
        project.metrics.map((metric, index) => ({
          project_id: projectRow.id,
          label: metric.label,
          value: metric.value,
          display_order: index,
        })),
      ),
      supabase.from("project_challenges").insert(
        project.challenges.map((text, index) => ({
          project_id: projectRow.id,
          text,
          display_order: index,
        })),
      ),
      supabase.from("project_decisions").insert(
        project.decisions.map((decision, index) => ({
          project_id: projectRow.id,
          decision: decision.decision,
          rationale: decision.rationale,
          tradeoff: decision.tradeoff,
          display_order: index,
        })),
      ),
      supabase.from("project_results").insert(
        project.results.map((text, index) => ({
          project_id: projectRow.id,
          text,
          display_order: index,
        })),
      ),
      supabase.from("project_lessons").insert(
        project.lessons.map((text, index) => ({
          project_id: projectRow.id,
          text,
          display_order: index,
        })),
      ),
      project.futureImprovements.length
        ? supabase.from("project_future_improvements").insert(
            project.futureImprovements.map((text, index) => ({
              project_id: projectRow.id,
              text,
              display_order: index,
            })),
          )
        : Promise.resolve({ error: null }),
      project.diagram
        ? supabase.from("project_architecture_diagrams").insert({
            project_id: projectRow.id,
            title: project.diagram.title,
            nodes_json: project.diagram.nodes,
            edges_json: project.diagram.edges,
          })
        : Promise.resolve({ error: null }),
    ]);

    for (const result of childInserts) {
      if (result.error) {
        throw new Error(`Failed to seed project relations: ${result.error.message}`);
      }
    }
  }

  for (const article of payload.articles) {
    const { data: articleRow, error: articleError } = await supabase
      .from("articles")
      .insert({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content_html: article.content_html,
        status: article.status,
        reading_time_minutes: article.reading_time_minutes,
        published_at: article.published_at,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
      })
      .select("id")
      .single();

    if (articleError || !articleRow) {
      throw new Error(`Failed to seed article: ${articleError?.message}`);
    }

    if (article.tags.length) {
      const { error: tagsError } = await supabase.from("article_tags").insert(
        article.tags.map((tag, index) => ({
          article_id: articleRow.id,
          tag,
          display_order: index,
        })),
      );

      if (tagsError) {
        throw new Error(`Failed to seed article tags: ${tagsError.message}`);
      }
    }
  }

  await supabase.from("audit_logs").insert({
    actor_id: adminUserId,
    action: "seed_completed",
    entity_type: "system",
    metadata_json: {
      admin_email: options.adminEmail,
      force: Boolean(options.force),
    },
  });

  const { error: metaError } = await supabase.from("app_meta").upsert(
    {
      key: SEED_META_KEY,
      value: "true",
    },
    { onConflict: "key" },
  );

  if (metaError) {
    throw new Error(`Failed to mark seed complete: ${metaError.message}`);
  }

  return {
    seeded: true,
    adminUserId,
    message: "Seed completed successfully.",
  };
}
