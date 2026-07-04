"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/projects/project-card";
import { FadeIn } from "@/components/motion/fade-in";
import { searchContent } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectListProps = {
  projects: Project[];
};

export function ProjectList({ projects }: ProjectListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const searchResults = searchContent(query).filter(
      (item) => item.type === "project",
    );
    const matchingSlugs = new Set(
      searchResults.map((result) => result.href.replace("/projects/", "")),
    );

    return projects.filter((project) => {
      const matchesTag = !activeTag || project.tags.includes(activeTag);
      const matchesSearch = !query.trim() || matchingSlugs.has(project.slug);
      return matchesTag && matchesSearch;
    });
  }, [projects, activeTag, query]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach((project) => project.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [projects]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects..."
          className="pl-9"
          aria-label="Search projects"
        />
      </div>

      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        <Button
          type="button"
          size="sm"
          variant={activeTag === null ? "default" : "outline"}
          onClick={() => setActiveTag(null)}
          aria-pressed={activeTag === null}
        >
          All
        </Button>
        {tags.map((tag) => (
          <Button
            key={tag}
            type="button"
            size="sm"
            variant={activeTag === tag ? "default" : "outline"}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
          >
            {tag}
          </Button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredProjects.length} project
        {filteredProjects.length === 1 ? "" : "s"} found
      </p>

      {filteredProjects.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground" role="status">
          No projects match your filters.
        </p>
      ) : (
        <ul className={cn("grid list-none gap-6")}>
          {filteredProjects.map((project, index) => (
            <li key={project.slug}>
              <FadeIn delay={index * 0.05}>
                <ProjectCard project={project} />
              </FadeIn>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
