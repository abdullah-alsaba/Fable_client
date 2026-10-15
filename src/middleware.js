import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function hasSessionCookie(request) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("better-auth.session_token") || cookie.name === "fable-jwt");
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    let user = session?.user;

    // Check fallback cookie if better-auth session is absent
    if (!user) {
      const jwtCookie = request.cookies.get("fable-jwt")?.value;
      const userCookie = request.cookies.get("fable-user")?.value;
      if (jwtCookie && userCookie) {
        try {
          user = JSON.parse(decodeURIComponent(userCookie));
        } catch {
          try {
            user = JSON.parse(userCookie);
          } catch {}
        }
      }
    }

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const rawRole = user.role || "user";
    const role = rawRole === "reader" ? "user" : rawRole;
    const isAdmin =
      user.email === "admin@fable.com" || role === "admin";

    if (pathname.startsWith("/dashboard/admin") && !isAdmin) {
      const dest = role === "writer" ? "/dashboard/writer" : "/dashboard/user";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    if (pathname.startsWith("/dashboard/writer") && role !== "writer" && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }

    return NextResponse.next();
  } catch {
    if (!hasSessionCookie(request)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
