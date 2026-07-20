import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Redirect old /unsubscribe links to the correct /alerts/unsubscribe path.
// Old digest emails linked to /unsubscribe?token=... instead of the actual
// route at /alerts/unsubscribe?token=... — this catches those and any other
// stale links.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const target = token
    ? `/alerts/unsubscribe?token=${token}`
    : "/alerts";
  return NextResponse.redirect(new URL(target, req.url), 302);
}
