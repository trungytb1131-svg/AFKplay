import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cho phép shrimp game và các game self-hosted được nhúng trong iframe cùng origin
  if (
    pathname.startsWith("/shrimp/") ||
    pathname.startsWith("/adventures-with-anxiety/") ||
    pathname.startsWith("/coming-out-simulator-2014/") ||
    pathname.startsWith("/we-become-what-we-behold/") ||
    pathname === "/test-shrimp.html"
  ) {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon|icon).*)"],
};
