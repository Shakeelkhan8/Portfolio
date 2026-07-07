import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database";
import { runSeed } from "../src/lib/seed/run-seed";

config({ path: ".env.local" });
config();

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

async function assertSchemaReady(
  supabase: ReturnType<typeof createClient<Database>>,
) {
  const { error: siteSettingsError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1);

  if (siteSettingsError) {
    throw new Error(
      `Database schema not ready (${siteSettingsError.message}). ` +
        "Run the three SQL migrations in Supabase SQL Editor first.",
    );
  }

  const { error: storageError } = await supabase.storage.listBuckets();
  if (storageError) {
    throw new Error(
      `Storage not ready (${storageError.message}). ` +
        "Run supabase/migrations/20260307120002_storage.sql in Supabase SQL Editor.",
    );
  }
}

async function main() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const adminEmail = process.env.ADMIN_EMAIL ?? "shakeelkhan4147@gmail.com";
  const adminPassword = getRequiredEnv("ADMIN_PASSWORD");

  if (adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  }

  const projectRef = getProjectRef(url);
  const confirmFlag = process.argv.find((arg) => arg.startsWith("--confirm="));
  const confirmRef = confirmFlag?.split("=")[1];

  if (!confirmRef || confirmRef !== projectRef) {
    throw new Error(
      `Refusing to seed without explicit confirmation. Re-run with:\n` +
        `  pnpm db:seed:production --confirm=${projectRef}`,
    );
  }

  if (process.argv.includes("--force")) {
    throw new Error(
      "Production seed refuses --force. Use pnpm db:seed:force locally against dev only.",
    );
  }

  console.log(`Target Supabase project: ${projectRef}`);
  console.log(`Admin email: ${adminEmail}`);
  console.log("Mode: non-destructive seed (existing content is preserved)");

  const supabase = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  await assertSchemaReady(supabase);

  const result = await runSeed(supabase, {
    adminEmail,
    adminPassword,
    force: false,
  });

  console.log(result.message);

  if (result.adminUserId) {
    console.log(`Admin user ready: ${adminEmail}`);
    console.log("Sign in at /admin/login with ADMIN_EMAIL + ADMIN_PASSWORD.");
    console.log("Do not add ADMIN_PASSWORD to Vercel.");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error";
  console.error(message);
  process.exit(1);
});
