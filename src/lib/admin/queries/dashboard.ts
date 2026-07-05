import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalSkills: number;
  unreadMessages: number;
  totalArticles: number;
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
    totalSkills: skillsResult.count ?? 0,
    unreadMessages: messagesResult.count ?? 0,
    totalArticles: articlesResult.count ?? 0,
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
      title: "Add project",
      description: "Create a new portfolio case study.",
      href: "/admin/projects",
    },
    {
      title: "Upload media",
      description: "Add images, PDFs, or videos to the library.",
      href: "/admin/media",
    },
    {
      title: "Review messages",
      description: "Read and respond to contact submissions.",
      href: "/admin/contact",
    },
    {
      title: "Site settings",
      description: "Update branding, SEO, and analytics.",
      href: "/admin/settings",
    },
  ];
}
