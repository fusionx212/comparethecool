"use client";

import { useEffect } from "react";

const COOKIE = "ctc_market";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

/** Remember the shopper's market so `/` geo-route respects a manual pick. */
export function RememberMarket({ code }: { code: string }) {
  useEffect(() => {
    if (!/^[a-z]{2}$/.test(code)) return;
    document.cookie = `${COOKIE}=${code}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  }, [code]);
  return null;
}
