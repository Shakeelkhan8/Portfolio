import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHeader } from "@/components/shared/page-header";
import { ArticleList } from "@/components/writing/article-list";
import { getArticles } from "@/lib/content";

export default async function WritingPage() {
  const articles = await getArticles();

  return (
    <>
      <PageHeader
        title="Writing"
        description="Technical articles on backend systems, architecture, and engineering decisions."
      />
      <Section spacing="sm" className="border-t border-border/60 pt-0">
        <Container>
          <ArticleList articles={articles} />
        </Container>
      </Section>
    </>
  );
}
