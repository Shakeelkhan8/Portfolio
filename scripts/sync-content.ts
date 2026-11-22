import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { getSeedPayload } from "../src/lib/seed/content-data";
import {
  applyPlans,
  decideSync,
  describePlans,
  hasChanges,
  planFromBackup,
  planFromSeed,
  readSnapshot,
  seedChanged,
  type SeedPayload,
  type Snapshot,
  type SyncDecision,
  type TablePlan,
} from "../src/lib/seed/sync-content";

/**
 * Flags:
 *   (none)                 dry run: print the plan, write nothing
 *   --apply --confirm=REF  write the plan (backup first)
 *   --restore=FILE --confirm=REF  put rows back from a backup
 *   --baseline=FILE        drift check against an older commit's seed (JSON
 *                          from scripts/export-seed.ts); blocks with exit 3
 *                          when the database no longer matches it; skips
 *                          when the seed itself didn't change
 *   --result=FILE          write noop | unchanged | dry-run | blocked | applied
 * In GitHub Actions the plan is also added to the job summary.
 */

config({ path: ".env.local" });
config();

const BACKUP_DIR = ".content-sync-backups";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getProjectRef(url: string): string {
  const match = url.match(/^https:\/\/([^.]+)\.supabase\.co\/?$/);
  if (!match) {
    throw new Error(
      `Unexpected Supabase URL format: ${url}. Expected https://<project-ref>.supabase.co`,
    );
  }
  return match[1];
}

function getFlag(name: string): string | undefined {
  return process.argv
    .find((arg) => arg.startsWith(`--${name}=`))
    ?.slice(name.length + 3);
}

async function main() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabase = createClient(
    url,
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: { persistSession: false },
    },
  );
  const projectRef = getProjectRef(url);
  const restorePath = getFlag("restore");
  const baselinePath = restorePath ? undefined : getFlag("baseline");
  const resultPath = getFlag("result");
  const write = process.argv.includes("--apply") || Boolean(restorePath);

  console.log(`Target Supabase project: ${projectRef}`);
  console.log(
    restorePath
      ? `Mode: restore from ${restorePath}`
      : `Mode: ${write ? "apply" : "dry run (nothing is written)"}`,
  );

  const current = await readSnapshot(supabase);
  const plans = restorePath
    ? planFromBackup(
        current,
        JSON.parse(readFileSync(restorePath, "utf8")) as Snapshot,
      )
    : planFromSeed(current);

  console.log("");
  for (const line of describePlans(plans)) console.log(line);
  console.log("");

  let baseline: { plans: TablePlan[]; seedChanged: boolean } | null = null;
  if (baselinePath) {
    const seed = JSON.parse(readFileSync(baselinePath, "utf8")) as SeedPayload;
    const snapshot = await readSnapshot(supabase, seed);
    baseline = {
      plans: planFromSeed(snapshot, seed),
      seedChanged: seedChanged(snapshot, seed, getSeedPayload()),
    };
  }
  const baselinePlans = baseline?.plans ?? null;
  const decision: SyncDecision = restorePath
    ? hasChanges(plans)
      ? "apply"
      : "noop"
    : decideSync(plans, baseline);

  if (decision === "noop" || decision === "unchanged") {
    if (decision === "unchanged") {
      const message =
        "Skipped: this commit didn't change the seed. The live content differs from it (Admin edits, or a sync that never ran) and is left as is.";
      console.log(process.env.GITHUB_ACTIONS ? `::warning::${message}` : message);
    }
    report(resultPath, decision, plans);
    return;
  }

  if (decision === "blocked") {
    console.log("Blocked: the live content no longer matches the previous");
    console.log("commit's seed, so this sync would overwrite these changes");
    console.log("(made in Admin, or by a sync that never ran):");
    for (const line of describePlans(baselinePlans ?? [])) console.log(line);
    console.log("Review them, then run the sync by hand or from the workflow.");
    report(resultPath, "blocked", plans, baselinePlans);
    process.exitCode = 3;
    return;
  }

  if (!write) {
    console.log(
      `To write these changes: pnpm content:sync --apply --confirm=${projectRef}`,
    );
    report(resultPath, "dry-run", plans);
    return;
  }

  if (getFlag("confirm") !== projectRef) {
    throw new Error(
      `Refusing to write without explicit confirmation. Re-run with --confirm=${projectRef}`,
    );
  }

  // The backup is written before any change, and the run stops if it fails.
  mkdirSync(BACKUP_DIR, { recursive: true });
  const backupPath = join(
    BACKUP_DIR,
    `${projectRef}-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  writeFileSync(backupPath, JSON.stringify(current, null, 2));
  console.log(`Backup of every row this run can change: ${backupPath}`);

  await applyPlans(supabase, plans);
  report(resultPath, "applied", plans);

  console.log("Done. Visitors still see the cached pages until you open");
  console.log('Admin → Settings and press "Refresh public pages". Check the');
  console.log("content in the admin panel first if you want to review it.");
  console.log(
    `To undo: pnpm content:sync --restore=${backupPath} --confirm=${projectRef}`,
  );
}

type Result = Exclude<SyncDecision, "apply"> | "dry-run" | "applied";

/** The outcome for the workflow, and the plan for the job summary. */
function report(
  resultPath: string | undefined,
  result: Result,
  plans: TablePlan[],
  drift?: TablePlan[] | null,
) {
  if (resultPath) writeFileSync(resultPath, result);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (!summary) return;
  const block = (lines: string[]) => ["```", ...lines, "```", ""].join("\n");
  appendFileSync(
    summary,
    [
      `### Content sync: ${result}`,
      "",
      "Plan (repo seed → live database):",
      block(describePlans(plans)),
      ...(drift
        ? ["Drift (previous seed → live database):", block(describePlans(drift))]
        : []),
    ].join("\n"),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
