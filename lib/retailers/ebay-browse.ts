/**
 * eBay Browse API — OAuth + item_summary search for product images.
 * Server/scripts only.
 */

export type EbayImageHit = {
  itemId: string;
  imageUrl: string;
  title?: string;
  price?: number;
};

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

function creds() {
  const clientId =
    process.env.EBAY_CLIENT_ID || process.env.EBAY_APP_ID || "";
  const clientSecret =
    process.env.EBAY_CLIENT_SECRET || process.env.EBAY_CERT_ID || "";
  return { clientId, clientSecret };
}

export function ebayBrowseConfigured(): boolean {
  const { clientId, clientSecret } = creds();
  return Boolean(clientId && clientSecret);
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const { clientId, clientSecret } = creds();
  if (!clientId || !clientSecret) throw new Error("eBay Browse API credentials missing");

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error(`eBay OAuth failed (${res.status})`);
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + ((data.expires_in ?? 7200) - 300) * 1000,
  };
  return data.access_token;
}

const MARKETPLACE_ID: Record<string, string> = {
  uk: "EBAY_GB",
  de: "EBAY_DE",
  fr: "EBAY_FR",
  it: "EBAY_IT",
  es: "EBAY_ES",
  nl: "EBAY_NL",
  us: "EBAY_US",
  au: "EBAY_AU",
  eu: "EBAY_DE",
};

export async function ebaySearchImage(
  query: string,
  countryCode: string,
): Promise<EbayImageHit | null> {
  const token = await getAccessToken();
  const marketplaceId = MARKETPLACE_ID[countryCode] || "EBAY_GB";
  const url = new URL("https://api.ebay.com/buy/browse/v1/item_summary/search");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  url.searchParams.set("filter", "buyingOptions:{FIXED_PRICE}");

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": marketplaceId,
    },
  });
  if (!res.ok) throw new Error(`eBay search ${res.status}`);
  const data = (await res.json()) as {
    itemSummaries?: Array<{
      itemId?: string;
      title?: string;
      image?: { imageUrl?: string };
      thumbnailImages?: Array<{ imageUrl?: string }>;
      price?: { value?: string };
    }>;
  };

  for (const item of data.itemSummaries || []) {
    const imageUrl =
      item.image?.imageUrl || item.thumbnailImages?.[0]?.imageUrl || null;
    if (imageUrl && item.itemId) {
      return {
        itemId: item.itemId,
        imageUrl,
        title: item.title,
        price: item.price?.value ? parseFloat(item.price.value) : undefined,
      };
    }
  }
  return null;
}
