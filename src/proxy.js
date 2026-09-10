import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function hasSessionCookie(request) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("better-auth.session_token"));
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const rawRole = session.user.role || "user";
    const role = rawRole === "reader" ? "user" : rawRole;
    const isAdmin =
      session.user.email === "admin@fable.com" || role === "admin";

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
