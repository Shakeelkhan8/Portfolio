import { NextResponse } from "next/server";
import { revalidateAllPublicContent } from "@/lib/db/revalidate";
import { checkRevalidateAuth } from "@/lib/security/revalidate-secret";

/**
 * Clears every public cache, the same as Admin → Settings → "Refresh public
 * pages". Called by the content sync workflow after it writes to the
 * database (.github/workflows/content-sync.yml). Safe to call twice: it only
 * marks caches stale.
 *
 * The response carries the deployment's commit so the caller can confirm it
 * reached the deployment it just synced for.
 */
export async function POST(request: Request) {
  const auth = checkRevalidateAuth(
    request.headers.get("authorization"),
    process.env.CONTENT_REVALIDATE_SECRET,
  );
  if (auth === "disabled") {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  if (auth === "denied") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  revalidateAllPublicContent();
  return NextResponse.json({
    revalidated: true,
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  });
}
