import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  applyPlans,
  describePlans,
  hasChanges,
  planFromBackup,
  planFromSeed,
  readSnapshot,
  type Snapshot,
} from "../src/lib/seed/sync-content";

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

  if (!hasChanges(plans)) return;

  if (!write) {
    console.log(
      `To write these changes: pnpm content:sync --apply --confirm=${projectRef}`,
    );
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

  console.log("Done. Visitors still see the cached pages until you open");
  console.log('Admin → Settings and press "Refresh public pages". Check the');
  console.log("content in the admin panel first if you want to review it.");
  console.log(
    `To undo: pnpm content:sync --restore=${backupPath} --confirm=${projectRef}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
