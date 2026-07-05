import { siteConfig } from "@/config/site";
import { routes } from "@/config/navigation";

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: siteConfig.legalName,
    jobTitle: siteConfig.title,
    description: siteConfig.description,
    email: siteConfig.email,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.location,
    },
    sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
    knowsAbout: siteConfig.expertise,
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.name} — Portfolio`,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}${routes.projects}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
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

export function getProjectSchema(project: {
  title: string;
  summary: string;
  slug: string;
  stack: string[];
  role: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${siteConfig.url}${routes.project(project.slug)}`,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    keywords: project.stack.join(", "),
    about: project.role,
  };
}

export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: getPersonSchema(),
    url: siteConfig.url,
  };
}

export function getArticleSchema(article: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: `${siteConfig.url}${routes.article(article.slug)}`,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
  };
}
