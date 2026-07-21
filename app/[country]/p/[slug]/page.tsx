import { COUNTRIES, getCountry } from "@/lib/countries";
import { STATUS_LABEL } from "@/lib/format";
import { StatusLed } from "@/components/StatusLed";
import Link from "next/link";
import type { StockStatus } from "@/lib/types";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog/products";
import { SEED_CATALOG } from "@/lib/catalog/seed-data";
import { wrapOfferUrl } from "@/lib/affiliate";
import { ProductImage } from "@/components/ProductImage";
import { DealActions } from "@/components/DealActions";
import { categoryPhoto } from "@/lib/product-image";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  const seen = new Set<string>();
  const params: { country: string; slug: string }[] = [];
  for (const p of SEED_CATALOG) {
    const key = `${p.country_code}:${p.data.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ country: p.country_code, slug: p.data.slug });
  }
  for (const code of Object.keys(COUNTRIES)) {
    if (![...seen].some((k) => k.startsWith(`${code}:`))) {
      params.push({ country: code, slug: "delonghi-pinguino-pac-n82" });
    }
  }
  return params;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country: code, slug } = await params;
  const cc = getCountry(code);
  const row = await getProductBySlug(code, slug);
  if (!row) notFound();

  const data = row.data;
  const offers = data.offers || [];
  const specs = data.specs || {};
  const editorial = data.editorial || { pros: [], cons: [], verdict: "", rating: 0 };
  const amazonOffer = offers.find((o) => o.retailer.id === "amazon");
  const ebayOffer = offers.find((o) => o.retailer.id === "ebay");
  const alternatives = await getRelatedProducts(code, row.id, 4);

  const amazonUrl = amazonOffer
    ? wrapOfferUrl(code, "amazon", amazonOffer.url, data.amazon_asin)
    : null;
  const ebayUrl = ebayOffer
    ? wrapOfferUrl(code, "ebay", ebayOffer.url, null, data.ebay_item_id)
    : null;

  // One local exit: Amazon for this country; eBay only if Amazon missing
  const dealOptions = (
    amazonUrl && amazonOffer
      ? [
          {
            id: "amazon",
            label: "Check today's price",
            priceLabel: `${cc.currencySymbol}${amazonOffer.price.toFixed(2)}`,
            href: amazonUrl,
            hint: `Opens ${cc.amazonMarketplace.replace("www.", "")}`,
          },
        ]
      : ebayUrl && ebayOffer
        ? [
            {
              id: "ebay",
              label: "Check today's price",
              priceLabel: `${cc.currencySymbol}${ebayOffer.price.toFixed(2)}`,
              href: ebayUrl,
              hint: "Opens local marketplace",
            },
          ]
        : []
  ) as {
    id: string;
    label: string;
    priceLabel: string;
    href: string;
    hint: string;
  }[];

  const imageSrc =
    row.image || data.image || categoryPhoto(data.category || "portable-air-conditioners");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href={`/${code}`} className="eyebrow mb-8 inline-block text-foreground/50 hover:text-brand">
        ← Back to {cc.name}
      </Link>

      <div className="ouac-grid mb-10 grid gap-8 border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
        <ProductImage
          name={data.name}
          image={imageSrc}
          category={data.category}
          amazonAsin={data.amazon_asin}
          className="aspect-square w-full"
        />

        <div className="flex flex-col justify-center gap-4">
          {data.brand && <p className="eyebrow text-brand">{data.brand}</p>}
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{data.name}</h1>
          {editorial.rating > 0 && (
            <p className="tnum text-lg font-semibold">{editorial.rating.toFixed(1)} / 5</p>
          )}
          <div className="flex items-center gap-3">
            <StatusLed status={row.stock_status as StockStatus} live />
            <span className="text-sm text-foreground/50 tnum">
              Last checked: {formatLastChecked(row.last_checked)}
            </span>
          </div>
          <p className="tnum text-3xl font-bold text-brand">
            {cc.currencySymbol}
            {(row.price ?? 0).toFixed(2)}
          </p>
          <DealActions
            country={code}
            productSlug={data.slug}
            options={dealOptions}
            primaryLabel="Check today's price"
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-xl font-bold">Technical specifications</h2>
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full text-sm">
                <tbody>
                  {specs.btu != null && (
                    <SpecRow label="Cooling capacity" value={`${specs.btu.toLocaleString()} BTU`} />
                  )}
                  {specs.room_size_m2 != null && (
                    <SpecRow label="Recommended room" value={`Up to ${specs.room_size_m2} m²`} />
                  )}
                  {specs.noise_db != null && (
                    <SpecRow label="Noise" value={`${specs.noise_db} dB`} />
                  )}
                  {specs.energy_rating && (
                    <SpecRow label="Energy rating" value={specs.energy_rating} />
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {(editorial.pros.length > 0 || editorial.cons.length > 0) && (
            <section className="grid gap-6 sm:grid-cols-2">
              <div className="border border-line bg-surface p-5">
                <h3 className="mb-3 font-bold text-instock">Pros</h3>
                <ul className="space-y-2 text-sm">
                  {editorial.pros.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-line bg-surface p-5">
                <h3 className="mb-3 font-bold text-sold">Cons</h3>
                <ul className="space-y-2 text-sm">
                  {editorial.cons.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {editorial.verdict && (
            <section className="border-t border-line pt-6">
              <h2 className="text-xl font-bold">Our verdict</h2>
              <p className="mt-4 leading-relaxed text-foreground/80">{editorial.verdict}</p>
            </section>
          )}
        </div>

        <aside>
          <h2 className="text-lg font-bold">Also consider</h2>
          <div className="mt-4 space-y-4">
            {alternatives.map((alt) => (
              <Link
                key={alt.id}
                href={`/${code}/p/${alt.data.slug}`}
                className="flex gap-3 border border-line bg-surface p-3 hover:border-brand"
              >
                <ProductImage
                  name={alt.data.name}
                  image={alt.image || alt.data.image}
                  category={alt.data.category}
                  amazonAsin={alt.data.amazon_asin}
                  className="h-16 w-16 flex-none"
                />
                <div className="min-w-0">
                  <p className="eyebrow text-brand">{alt.data.brand}</p>
                  <p className="mt-1 font-semibold leading-snug">{alt.data.name}</p>
                  <p className="tnum mt-1 text-brand">
                    {cc.currencySymbol}
                    {(alt.price ?? 0).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <section className="mt-12 border-t border-line pt-8 text-center text-xs text-foreground/40">
        Prices last updated {formatLastChecked(row.last_checked)}. We earn a commission on purchases
        through our links at no extra cost to you. Status: {STATUS_LABEL[row.stock_status as StockStatus]}.{" "}
        <Link href={`/${code}/disclosure`} className="underline hover:text-brand">
          Learn more
        </Link>
        .
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: data.name,
            brand: data.brand,
            offers: offers.map((o) => ({
              "@type": "Offer",
              price: o.price,
              priceCurrency: cc.currency,
              availability:
                o.status === "in_stock"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: wrapOfferUrl(code, o.retailer.id, o.url, data.amazon_asin, data.ebay_item_id),
            })),
          }),
        }}
      />

      {(dealOptions.length > 0) && (
        <div className="sticky-buy mt-10 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="tnum text-lg font-bold">
            {cc.currencySymbol}
            {(row.price ?? 0).toFixed(2)}
          </p>
          <DealActions
            country={code}
            productSlug={data.slug}
            options={dealOptions}
            primaryLabel="See deals"
          />
        </div>
      )}
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="px-4 py-3 font-semibold text-foreground/60">{label}</td>
      <td className="px-4 py-3 tnum text-right font-medium">{value}</td>
    </tr>
  );
}

function formatLastChecked(iso: string | null | undefined): string {
  if (!iso) return "unknown";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
