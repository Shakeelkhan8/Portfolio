import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { getFeaturedArticles } from "@/lib/content";
import { routes } from "@/config/navigation";
import { formatDate } from "@/lib/formatters";

export async function WritingPreviewList() {
  const articles = await getFeaturedArticles();

  if (articles.length === 0) {
    return (
      <EmptyState
        title="Articles in progress"
        description="Technical writing on backend systems and architecture is coming soon."
        action={
          <ButtonLink href={routes.writing} variant="outline">
            View Writing
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="divide-y divide-border rounded-xl border border-border">
      {articles.map((article) => (
        <AppLink
          key={article.slug}
          href={routes.article(article.slug)}
          showExternalIcon={false}
          className="group flex items-center justify-between gap-4 px-6 py-5 hover:bg-muted/30"
        >
          <div>
            <p className="font-medium text-foreground group-hover:text-primary">
              {article.title}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDate(article.date)} · {article.readingTime} min read
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </AppLink>
      ))}
    </div>
  );
}
