import { NextResponse } from "next/server";

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const cookies = request.cookies.getAll();
  const hasBetterAuthToken = cookies.some((c) =>
    c.name.includes("better-auth.session_token")
  );
  const jwtCookie = request.cookies.get("fable-jwt")?.value;
  const userCookie = request.cookies.get("fable-user")?.value;

  // If no auth tokens or session cookies exist, redirect to login
  if (!hasBetterAuthToken && !jwtCookie && !userCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user cookie is present, enforce role-based route access
  if (userCookie) {
    try {
      let user;
      try {
        user = JSON.parse(decodeURIComponent(userCookie));
      } catch {
        user = JSON.parse(userCookie);
      }

      const rawRole = user?.role || "user";
      const role = rawRole === "reader" ? "user" : rawRole;
      const isAdmin = user?.email === "admin@fable.com" || role === "admin";

      if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
        const dest = role === "writer" ? "/dashboard/writer" : "/dashboard/user";
        return NextResponse.redirect(new URL(dest, request.url));
      }

      if (pathname.startsWith("/dashboard/writer") && role !== "writer" && !isAdmin) {
        return NextResponse.redirect(new URL("/dashboard/user", request.url));
      }
    } catch {
      // Allow request to proceed to page component if cookie parsing encounters an edge case
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
