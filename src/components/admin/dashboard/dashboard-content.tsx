import Link from "next/link";
import {
  ArrowRight,
  FileText,
  FolderKanban,
  Mail,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/shared/button-link";
import {
  getDashboardStats,
  getQuickActions,
  getRecentActivity,
} from "@/lib/admin/queries/dashboard";

function formatAction(action: string) {
  return action.replaceAll("_", " ");
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export async function DashboardContent() {
  const [stats, activity, quickActions] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getQuickActions(),
  ]);

  const statCards = [
    {
      label: "Total projects",
      value: stats.totalProjects,
      icon: FolderKanban,
    },
    {
      label: "Published",
      value: stats.publishedProjects,
      icon: FileText,
    },
    {
      label: "Draft projects",
      value: stats.draftProjects,
      icon: FolderKanban,
    },
    {
      label: "Skills",
      value: stats.totalSkills,
      icon: Sparkles,
    },
    {
      label: "Unread messages",
      value: stats.unreadMessages,
      icon: Mail,
    },
  ];

  return (
    <div className="space-y-8">
      {!stats.seedCompleted ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <p className="font-medium text-foreground">Database not seeded yet</p>
          <p className="mt-1 text-muted-foreground">
            Run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5">pnpm db:seed</code>{" "}
            after applying Supabase migrations to import your existing portfolio
            content.
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-start justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
              >
                <div>
                  <p className="font-medium">{action.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Activity will appear here after you sign in and make changes.
              </p>
            ) : (
              <ul className="space-y-3">
                {activity.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {formatAction(entry.action)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.entity_type}
                      </p>
                    </div>
                    <time
                      className="shrink-0 text-xs text-muted-foreground"
                      dateTime={entry.created_at}
                    >
                      {formatTimestamp(entry.created_at)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-dashed border-border p-6">
        <p className="font-medium">Phase 1 complete</p>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Foundation is ready: Supabase schema, auth, admin shell, and seed
          tooling. Content management screens will be built in Phase 2.
        </p>
        <div className="mt-4">
          <ButtonLink href="/" variant="outline">
            View public site
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
