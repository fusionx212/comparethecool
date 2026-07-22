/**
 * Lightweight Amazon PDP probe for markets where Creators API isn't linked.
 * Detects hard 404 / dog page — not true live stock, but blocks dead Buy links.
 */

export type AmazonPdpProbe = "ok" | "missing" | "unknown";

const DEAD =
  /Dogs of Amazon|Page Not Found|looking for something\?|Seite wurde nicht gefunden|Page introuvable/i;

export async function probeAmazonPdp(
  marketplace: string,
  asin: string,
): Promise<AmazonPdpProbe> {
  const host = marketplace.replace(/^https?:\/\//, "");
  const url = `https://${host}/dp/${asin}`;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CompareTheCoolBot/1.0; +https://comparethecool.com)",
        Accept: "text/html",
        "Accept-Language": "en-GB,en;q=0.8",
      },
    });
    if (res.status === 404 || res.status === 410) return "missing";
    if (res.status >= 400) return "unknown";
    const html = (await res.text()).slice(0, 80_000);
    if (DEAD.test(html)) return "missing";
    // Bot/captcha HTML often omits the ASIN — treat as unknown, not dead.
    return "ok";
  } catch {
    return "unknown";
  }
}
