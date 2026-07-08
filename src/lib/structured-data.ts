import { routes } from "@/config/navigation";
import type { SiteConfig } from "@/types/cms";

export function getPersonSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.legalName,
    jobTitle: site.title,
    description: site.description,
    email: site.email,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressCountry: site.location,
    },
    sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
    knowsAbout: site.expertise,
  };
}

export function getWebSiteSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.name} — Portfolio`,
    url: site.url,
    description: site.description,
    author: {
      "@type": "Person",
      name: site.name,
    },
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

export function getProjectSchema(
  site: SiteConfig,
  project: {
    title: string;
    summary: string;
    slug: string;
    stack: string[];
    role: string;
  },
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${site.url}${routes.project(project.slug)}`,
    author: {
      "@type": "Person",
      name: site.name,
    },
    keywords: project.stack.join(", "),
    about: project.role,
  };
}

export function getProfilePageSchema(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: getPersonSchema(site),
    url: site.url,
  };
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
    author: {
      "@type": "Person",
      name: site.name,
    },
  };
}
