import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_DASHBOARDS: Record<string, string> = {
  ADMIN: "/admin",
  OWNER: "/owner",
  TENANT: "/tenant",
  MANAGER: "/manager",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("nesthive.token")?.value;
  const role = request.cookies.get("nesthive.role")?.value?.toUpperCase();

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isPortal =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/owner") ||
    pathname.startsWith("/tenant") ||
    pathname.startsWith("/manager");

  // Redirect authenticated users away from auth pages to their respective dashboards
  if (isAuthPage && token && role && ROLE_DASHBOARDS[role]) {
    return NextResponse.redirect(new URL(ROLE_DASHBOARDS[role], request.url));
  }

  // Protect portal routes
  if (isPortal) {
    if (!token && !role) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Control (RBAC) enforcement
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      const target = (role && ROLE_DASHBOARDS[role]) || "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith("/owner") && role !== "OWNER" && role !== "ADMIN") {
      const target = (role && ROLE_DASHBOARDS[role]) || "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith("/tenant") && role !== "TENANT" && role !== "ADMIN") {
      const target = (role && ROLE_DASHBOARDS[role]) || "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (pathname.startsWith("/manager") && role !== "MANAGER" && role !== "ADMIN") {
      const target = (role && ROLE_DASHBOARDS[role]) || "/login";
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/owner/:path*",
    "/tenant/:path*",
    "/manager/:path*",
    "/login",
    "/register",
    "/verify-email",
  ],
};

