import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/utils/supabase/middleware";

const ADMIN_PUBLIC_ROUTES = new Set([
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
]);

export async function updateSession(request: NextRequest) {
  const { supabase, supabaseResponse } = createMiddlewareClient(request);

  if (!supabase) {
    const pathname = request.nextUrl.pathname;

    if (
      pathname.startsWith("/admin") &&
      !ADMIN_PUBLIC_ROUTES.has(pathname)
    ) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isPublicAdminRoute = ADMIN_PUBLIC_ROUTES.has(pathname);

  if (isAdminRoute) {
    if (!user && !isPublicAdminRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user && isPublicAdminRoute) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin/dashboard";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }

    if (user && !isPublicAdminRoute) {
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminUser) {
        await supabase.auth.signOut();
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(loginUrl);
      }
    }

    return supabaseResponse;
  }

  const { data: maintenanceSettings } = await supabase
    .from("site_settings")
    .select("maintenance_enabled, maintenance_message")
    .limit(1)
    .maybeSingle();

  if (maintenanceSettings?.maintenance_enabled) {
    const message =
      maintenanceSettings.maintenance_message?.trim() ||
      "This site is temporarily down for maintenance. Please check back soon.";

    return new NextResponse(
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Maintenance</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fafafa; color: #171717; }
      main { max-width: 36rem; padding: 2rem; text-align: center; }
      h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
      p { line-height: 1.6; color: #525252; }
    </style>
  </head>
  <body>
    <main>
      <h1>Under maintenance</h1>
      <p>${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    </main>
  </body>
</html>`,
      {
        status: 503,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Retry-After": "3600",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  return supabaseResponse;
}
