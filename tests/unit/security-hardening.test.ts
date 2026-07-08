import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "@/lib/security/headers";

const migrationDir = resolve(process.cwd(), "supabase/migrations");

function readMigration(filename: string) {
  return readFileSync(resolve(migrationDir, filename), "utf8");
}

describe("security headers", () => {
  it("includes core hardening headers", () => {
    const keys = SECURITY_HEADERS.map((header) => header.key);

    expect(keys).toContain("X-Frame-Options");
    expect(keys).toContain("X-Content-Type-Options");
    expect(keys).toContain("Referrer-Policy");
    expect(keys).toContain("Strict-Transport-Security");
  });
});

describe("RLS policy coverage", () => {
  it("enables RLS on every public schema table", () => {
    const schemaSql = readMigration("20260307120000_initial_schema.sql");
    const rlsSql = readMigration("20260307120001_rls_policies.sql");

    const tables = [
      ...schemaSql.matchAll(/CREATE TABLE public\.([a-z_]+)/g),
    ].map((match) => match[1]);

    expect(tables.length).toBeGreaterThan(0);

    for (const table of tables) {
      expect(rlsSql).toContain(
        `ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`,
      );
    }
  });

  it("defines admin write policies for contact submissions", () => {
    const rlsSql = readMigration("20260307120001_rls_policies.sql");
    expect(rlsSql).toContain("contact_submissions_admin_all");
  });

  it("removes public contact INSERT and indexes ip_hash for rate limiting", () => {
    const hardenSql = readMigration(
      "20260708120000_harden_contact_submissions.sql",
    );

    expect(hardenSql).toContain(
      "DROP POLICY IF EXISTS contact_submissions_public_insert",
    );
    expect(hardenSql).toContain(
      "contact_submissions_ip_hash_created_at_idx",
    );
  });
});
