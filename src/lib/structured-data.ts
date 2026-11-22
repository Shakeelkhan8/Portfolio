import { routes } from "@/config/navigation";
import type { SiteConfig } from "@/types/cms";
import type { ProjectLink } from "@/types";

/**
 * Schema.org nodes reference the site owner by `@id` rather than repeating
 * the Person object, so crawlers see one entity no matter how many nodes
 * mention it.
 */
function personId(site: SiteConfig): string {
  return `${site.url}/#person`;
}

function websiteId(site: SiteConfig): string {
  return `${site.url}/#website`;
}

const personRef = (site: SiteConfig) => ({ "@id": personId(site) });

/**
 * The site owner. Deliberately no legal name, address, city or country: the
 * same fields toPublicSiteConfig() keeps out of client components (see the
 * "keep phone and location out of the page HTML" fix). This schema is on
 * every page, so it must not reintroduce them.
 */
export function getPersonSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(site),
    name: site.name,
    jobTitle: site.title,
    description: site.description,
    email: site.email,
    url: site.url,
    // Professional profiles, so search engines connect them to this person.
    // Freelance marketplaces are left out: the portfolio no longer sells packaged services
    // (2026-11-19).
    sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
    knowsAbout: site.expertise,
  };
}

export function getWebSiteSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId(site),
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: personRef(site),
  };
}

export function getProfilePageSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: site.url,
    isPartOf: { "@id": websiteId(site) },
    mainEntity: personRef(site),
  };
}

/** One JSON-LD document for every page: Person, WebSite and ProfilePage. */
export function getRootSchemaGraph(site: SiteConfig) {
  // Nodes inside @graph inherit the document's @context.
  const strip = <T extends Record<string, unknown>>(node: T) =>
    Object.fromEntries(
      Object.entries(node).filter(([key]) => key !== "@context"),
    );

  return {
    "@context": "https://schema.org",
    "@graph": [
      strip(getPersonSchema(site)),
      strip(getWebSiteSchema(site)),
      strip(getProfilePageSchema(site)),
    ],
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Projects with a public GitHub link are `SoftwareSourceCode` (with the repo
 * as `codeRepository`); everything else is a `CreativeWork` case study.
 */
export function getProjectSchema(
  site: SiteConfig,
  project: {
    title: string;
    summary: string;
    slug: string;
    stack: string[];
    links: ProjectLink[];
  },
) {
  const repository = project.links.find((link) =>
    link.href.startsWith("https://github.com/"),
  );
  const base = {
    "@context": "https://schema.org",
    name: project.title,
    description: project.summary,
    url: `${site.url}${routes.project(project.slug)}`,
    author: personRef(site),
    keywords: project.stack.join(", "),
  };

  if (repository) {
    return {
      ...base,
      "@type": "SoftwareSourceCode",
      codeRepository: repository.href,
      programmingLanguage: project.stack.slice(0, 3),
    };
  }

  return { ...base, "@type": "CreativeWork" };
}

export function getArticleSchema(
  site: SiteConfig,
  article: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `${site.url}${routes.article(article.slug)}`,
    datePublished: article.date,
    author: personRef(site),
  };
}

