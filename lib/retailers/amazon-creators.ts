/**
 * Amazon Creators API — OAuth + getItems / searchItems.
 * Server/scripts only. Never expose credentials to the client.
 */

export type CreatorsImageHit = {
  asin: string;
  imageUrl: string;
  title?: string;
};

type TokenCache = { token: string; expiresAt: number };
let tokenCache: TokenCache | null = null;

function creds() {
  const clientId = process.env.AMAZON_CREATORS_API_CLIENT_ID || "";
  const clientSecret = process.env.AMAZON_CREATORS_API_CLIENT_SECRET || "";
  return { clientId, clientSecret };
}

export function amazonCreatorsConfigured(): boolean {
  const { clientId, clientSecret } = creds();
  return Boolean(clientId && clientSecret);
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const { clientId, clientSecret } = creds();
  if (!clientId || !clientSecret) throw new Error("Amazon Creators API credentials missing");

  const res = await fetch("https://api.amazon.co.uk/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "creatorsapi::default",
    }),
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error?: string };
  if (!data.access_token) {
    throw new Error(`Creators OAuth failed (${res.status})`);
  }
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + ((data.expires_in ?? 3600) - 120) * 1000,
  };
  return data.access_token;
}

function extractImage(item: Record<string, unknown>): string | null {
  const images = item.images as
    | { primary?: { large?: { url?: string }; medium?: { url?: string } } }
    | undefined;
  return images?.primary?.large?.url || images?.primary?.medium?.url || null;
}

export async function creatorsGetItemsImages(
  asins: string[],
  marketplace: string,
  partnerTag: string,
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!asins.length) return out;
  const token = await getAccessToken();

  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);
    const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-marketplace": marketplace,
      },
      body: JSON.stringify({
        itemIds: batch,
        itemIdType: "ASIN",
        partnerTag,
        partnerType: "Associates",
        marketplace,
        resources: ["images.primary.large", "images.primary.medium", "itemInfo.title"],
      }),
    });
    const data = (await res.json()) as {
      itemsResult?: { items?: Array<Record<string, unknown>> };
    };
    for (const item of data.itemsResult?.items || []) {
      const asin = String(item.asin || "");
      const img = extractImage(item);
      if (asin && img) out.set(asin, img);
    }
  }
  return out;
}

export type CreatorsStockHit = {
  asin: string;
  status: "in_stock" | "out_of_stock" | "not_found";
  price: number | null;
  imageUrl: string | null;
  title: string | null;
};

const STOCK_RESOURCES = [
  "itemInfo.title",
  "offersV2.listings.price",
  "offersV2.listings.availability",
  "images.primary.large",
];

/** Live Amazon availability + price for a marketplace (batches of 10). */
export async function creatorsGetItemsStock(
  asins: string[],
  marketplace: string,
  partnerTag: string,
): Promise<Map<string, CreatorsStockHit>> {
  const out = new Map<string, CreatorsStockHit>();
  if (!asins.length) return out;
  const token = await getAccessToken();

  for (let i = 0; i < asins.length; i += 10) {
    const batch = asins.slice(i, i + 10);
    const res = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "x-marketplace": marketplace,
      },
      body: JSON.stringify({
        itemIds: batch,
        itemIdType: "ASIN",
        partnerTag,
        partnerType: "Associates",
        marketplace,
        resources: STOCK_RESOURCES,
      }),
    });
    const data = (await res.json()) as {
      itemsResult?: { items?: Array<Record<string, unknown>> };
      errors?: Array<{ message?: string }>;
      message?: string;
      reason?: string;
    };
    if (!res.ok || data.reason === "InvalidAssociate") {
      const msg =
        data.errors?.[0]?.message ||
        data.message ||
        `Creators getItems HTTP ${res.status}`;
      throw new Error(msg);
    }
    const found = new Set<string>();
    for (const item of data.itemsResult?.items || []) {
      const asin = String(item.asin || "");
      if (!asin) continue;
      found.add(asin);
      const offersV2 = item.offersV2 as
        | { listings?: Array<Record<string, unknown>> }
        | undefined;
      const listing = offersV2?.listings?.[0];
      const avail = (listing?.availability || {}) as { type?: string; message?: string };
      const money = (listing?.price as { money?: { amount?: number } } | undefined)?.money;
      const atype = (avail.type || "").toUpperCase();
      let status: CreatorsStockHit["status"] = "out_of_stock";
      if (
        atype === "AVAILABLE_DATE" ||
        atype === "NOW" ||
        atype === "IN_STOCK" ||
        atype === "LEADTIME"
      ) {
        status = "in_stock";
      }
      out.set(asin, {
        asin,
        status,
        price: typeof money?.amount === "number" ? money.amount : null,
        imageUrl: extractImage(item),
        title:
          (item.itemInfo as { title?: { displayValue?: string } } | undefined)?.title
            ?.displayValue || null,
      });
    }
    for (const a of batch) {
      if (!found.has(a)) {
        out.set(a, {
          asin: a,
          status: "not_found",
          price: null,
          imageUrl: null,
          title: null,
        });
      }
    }
  }
  return out;
}

export async function creatorsSearchImage(
  keywords: string,
  marketplace: string,
  partnerTag: string,
): Promise<CreatorsImageHit | null> {
  const token = await getAccessToken();
  const res = await fetch("https://creatorsapi.amazon/catalog/v1/searchItems", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": marketplace,
    },
    body: JSON.stringify({
      keywords,
      partnerTag,
      partnerType: "Associates",
      marketplace,
      itemCount: 5,
      resources: ["images.primary.large", "images.primary.medium", "itemInfo.title"],
    }),
  });
  const data = (await res.json()) as {
    itemsResult?: { items?: Array<Record<string, unknown>> };
    searchResult?: { items?: Array<Record<string, unknown>> };
    errors?: Array<{ message?: string; code?: string }>;
    message?: string;
  };
  if (!res.ok) {
    const msg = data.errors?.[0]?.message || data.message || `HTTP ${res.status}`;
    throw new Error(`Creators searchItems: ${msg}`);
  }
  const items = data.searchResult?.items || data.itemsResult?.items || [];
  for (const item of items) {
    const asin = String(item.asin || "");
    const img = extractImage(item);
    if (asin && img) {
      const title = (item.itemInfo as { title?: { displayValue?: string } } | undefined)?.title
        ?.displayValue;
      return { asin, imageUrl: img, title };
    }
  }
  return null;
}
