import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * comparetheheat.com serves the same paths as cool, but country homes
 * are statically built under /heat/{country} with heating-first catalog.
 * Rewrite keeps public URLs clean (/uk stays /uk).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase() || "";
  if (!host.includes("comparetheheat")) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/heat") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/img") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Only rewrite bare country homes: /uk, /de, … (not /uk/best/…)
  const countryOnly = pathname.match(/^\/([a-z]{2}|eu)\/?$/i);
  if (!countryOnly) return NextResponse.next();

  const code = countryOnly[1].toLowerCase();
  const url = request.nextUrl.clone();
  url.pathname = `/heat/${code}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/uk", "/de", "/fr", "/it", "/es", "/nl", "/us", "/au", "/eu"],
};
