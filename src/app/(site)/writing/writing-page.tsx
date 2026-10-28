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
        eyebrow="Writing"
        title="Writing"
        description="Short notes on backend problems I've worked through: tenant isolation, payments and keeping systems reliable."
      />
      <Section spacing="sm">
        <Container>
          <ArticleList articles={articles} />
        </Container>
      </Section>
    </>
  );
}
