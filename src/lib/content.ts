import { projects } from "@/content/projects";
import { articles } from "@/content/writing";
import { experience } from "@/content/experience";
import type { Project, Article, ExperienceEntry } from "@/types";

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getArticles(): Article[] {
  return articles.filter((a) => a.published);
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getArticles()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug && a.published);
}

export function getExperience(): ExperienceEntry[] {
  return experience;
}

export function getFeaturedExperience(): ExperienceEntry | undefined {
  return experience.find((e) => e.featured) ?? experience[0];
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
): string {
  const start = formatMonthYear(startDate);
  const end = endDate ? formatMonthYear(endDate) : "Present";
  return `${start} – ${end}`;
}

export function formatMonthYear(date: string): string {
  const [year, month] = date.split("-");
  const dateObj = new Date(Number(year), Number(month) - 1);
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day ?? 1));
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
