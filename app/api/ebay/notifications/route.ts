// POST /api/ebay/notifications — eBay Marketplace Account Deletion endpoint
// Handles GDPR-mandated user data deletion notifications from eBay.
//
// Verification flow: eBay sends GET ?challenge_code=xxx
// We respond with SHA-256(challengeCode + verificationToken + endpoint) as hex.
// See: https://developer.ebay.com/develop/guides-v2/marketplace-user-account-deletion
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";

const VERIFICATION_TOKEN = "UKAC-eBay-Notify-2026-Verify-X9mK2pL";
const ENDPOINT = "https://ukaircontracker.co.uk/api/ebay/notifications";

// eBay endpoint verification: SHA-256 hash of challengeCode + token + endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challengeCode = searchParams.get("challenge_code");

  if (challengeCode) {
    const hash = createHash("sha256");
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(ENDPOINT);
    const responseHash = hash.digest("hex");

    return NextResponse.json({ challengeResponse: responseHash });
  }

  // No challenge? Return OK for health checks
  return NextResponse.json({ status: "ok" });
}

// Receive Marketplace Account Deletion notifications (POST with JSON body)
export async function POST(req: NextRequest) {
  const body = await req.text();

  console.log("[ebay-notification] deletion notice received:", body.substring(0, 500));

  // Acknowledge immediately with 200 — eBay retries unacknowledged notifications
  return new NextResponse(null, { status: 200 });
}
