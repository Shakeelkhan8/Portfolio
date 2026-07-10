import { ArrowRight } from "lucide-react";
import { AppLink } from "@/components/shared/app-link";
import { ButtonLink } from "@/components/shared/button-link";
import { EmptyState } from "@/components/shared/empty-state";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
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
    <Stagger
      className="overflow-hidden rounded-2xl border border-border/70 bg-surface/50 divide-y divide-border/60"
      stagger={0.08}
    >
      {articles.map((article) => (
        <StaggerItem key={article.slug}>
          <AppLink
            href={routes.article(article.slug)}
            showExternalIcon={false}
            className="group flex items-center justify-between gap-4 px-6 py-5 transition-colors duration-300 hover:bg-foreground/[0.03]"
          >
            <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-1">
              <p className="font-heading font-medium tracking-tight text-foreground">
                {article.title}
              </p>
              <p className="mt-1.5 font-mono text-[11px] tracking-wide text-muted-foreground">
                {formatDate(article.date)} · {article.readingTime} min read
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
          </AppLink>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
