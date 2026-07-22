/**
 * Netlify scheduled function — every 2 hours.
 * Calls the Next stock cron with CRON_SECRET.
 */
import type { Config } from "@netlify/functions";

export default async () => {
  const site = process.env.URL || process.env.DEPLOY_PRIME_URL || "https://comparethecool.com";
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET missing — skip stock update");
    return new Response("CRON_SECRET missing", { status: 500 });
  }

  const res = await fetch(`${site.replace(/\/$/, "")}/api/cron/update-stock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cron-secret": secret,
    },
    body: "{}",
  });
  const text = await res.text();
  console.log("stock update", res.status, text.slice(0, 500));
  return new Response(text, { status: res.status });
};

export const config: Config = {
  schedule: "0 */2 * * *",
};
