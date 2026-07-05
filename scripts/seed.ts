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

async function main() {
  const url = getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const adminEmail = process.env.ADMIN_EMAIL ?? "shakeelkhan4147@gmail.com";
  const adminPassword = getRequiredEnv("ADMIN_PASSWORD");
  const force = process.argv.includes("--force");

  const supabase = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const result = await runSeed(supabase, {
    adminEmail,
    adminPassword,
    force,
  });

  console.log(result.message);

  if (result.adminUserId) {
    console.log(`Admin user: ${adminEmail}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown seed error";
  console.error(message);
  process.exit(1);
});
