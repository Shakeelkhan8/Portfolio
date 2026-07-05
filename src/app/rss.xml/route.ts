import { getArticles } from "@/lib/content";
import { getSiteConfig } from "@/lib/db/queries/site";

export async function GET() {
  const [site, articles] = await Promise.all([getSiteConfig(), getArticles()]);

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${site.url}/writing/${article.slug}</link>
      <guid>${site.url}/writing/${article.slug}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
    </item>`,
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${site.name} — Writing</title>
    <link>${site.url}/writing</link>
    <description>${site.description}</description>
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
