import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalArticles: number;
  publishedPages: number;
  totalSkills: number;
  unreadMessages: number;
  testimonials: number;
  services: number;
  certifications: number;
  resumeVersions: number;
  curatedRepos: number;
  seedCompleted: boolean;
};

export type RecentActivity = {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    projectsResult,
    skillsResult,
    messagesResult,
    articlesResult,
    pagesResult,
    testimonialsResult,
    servicesResult,
    certificationsResult,
    resumeResult,
    curatedResult,
    seedResult,
  ] = await Promise.all([
    supabase.from("projects").select("status", { count: "exact" }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "unread"),
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase
      .from("pages")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .is("deleted_at", null),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("certifications").select("id", { count: "exact", head: true }),
    supabase.from("resume_versions").select("id", { count: "exact", head: true }),
    supabase.from("curated_repos").select("id", { count: "exact", head: true }),
    supabase
      .from("app_meta")
      .select("value")
      .eq("key", "seed_completed")
      .maybeSingle(),
  ]);

  const projects = projectsResult.data ?? [];
  const publishedProjects = projects.filter(
    (project) => project.status === "published",
  ).length;

  return {
    totalProjects: projects.length,
    publishedProjects,
    draftProjects: projects.length - publishedProjects,
    totalArticles: articlesResult.count ?? 0,
    publishedPages: pagesResult.count ?? 0,
    totalSkills: skillsResult.count ?? 0,
    unreadMessages: messagesResult.count ?? 0,
    testimonials: testimonialsResult.count ?? 0,
    services: servicesResult.count ?? 0,
    certifications: certificationsResult.count ?? 0,
    resumeVersions: resumeResult.count ?? 0,
    curatedRepos: curatedResult.count ?? 0,
    seedCompleted: seedResult.data?.value === "true",
  };
}

export async function getRecentActivity(limit = 8): Promise<RecentActivity[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, entity_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getQuickActions() {
  return [
    {
      title: "New project",
      description: "Create a portfolio case study.",
      href: "/admin/projects/new",
    },
    {
      title: "New article",
      description: "Write and publish a blog post.",
      href: "/admin/blog/new",
    },
    {
      title: "Custom page",
      description: "Publish a landing or legal page.",
      href: "/admin/pages/new",
    },
    {
      title: "Upload media",
      description: "Add images, PDFs, or documents.",
      href: "/admin/media",
    },
    {
      title: "Review messages",
      description: "Read contact form submissions.",
      href: "/admin/contact",
    },
    {
      title: "Site settings",
      description: "Update branding, SEO, and analytics.",
      href: "/admin/settings",
    },
  ];
}
