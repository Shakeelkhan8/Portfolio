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
  }

  return supabaseResponse;
}
