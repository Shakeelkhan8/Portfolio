import { getArticles } from "@/lib/content";
import { siteConfig } from "@/config/site";

export async function GET() {
  const articles = getArticles();

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteConfig.url}/writing/${article.slug}</link>
      <guid>${siteConfig.url}/writing/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} — Writing</title>
    <link>${siteConfig.url}/writing</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
