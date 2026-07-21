import { COUNTRIES, getCountry } from "@/lib/countries";
import { supabase } from "@/lib/supabase";
import { STATUS_LABEL } from "@/lib/format";
import { StatusLed } from "@/components/StatusLed";
import Link from "next/link";
import type { StockStatus } from "@/lib/types";
import { notFound } from "next/navigation";

/* ──────────────────────────────────────────────
   Types extracted from the JSONB data shape
   ────────────────────────────────────────────── */

interface ProductSpecs {
  noise_db?: number | null;
  energy_rating?: string | null;
  weight_kg?: number | null;
  dimensions?: string | null;
  cooling_power_w?: number | null;
  heating_power_w?: number | null;
  features?: string[];
  room_size_m2?: number | null;
  btu?: number | null;
}

interface Editorial {
  pros: string[];
  cons: string[];
  verdict: string;
  rating: number;
}

interface Offer {
  retailer: { id: string; name: string };
  price: number;
  url: string;
  status: StockStatus;
  lastChecked: string;
}

/* ──────────────────────────────────────────────
   Static params — pre-generate known paths
   ────────────────────────────────────────────── */

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  // Use all known product slugs from our data + fallback static slugs
  const slugs = [
    "midea-portasplit",
    "delonghi-ex105",
    "comfee-breezy",
    "trotec-pac3500",
    "klartein-kraft",
    "aeg-chillflex",
    "whirlpool-pacw",
    "hisense-easy",
    "samsung-wind",
    "daewoo-col",
    "portable-air-conditioner",
    "dehumidifier",
    "air-purifier",
    "tower-fan",
    "pedestal-fan",
    "evaporative-cooler",
    "oil-radiator",
    "electric-blanket",
    "smart-thermostat",
    "fridge-freezer",
    "chest-freezer",
    "wine-cooler",
    "mini-fridge",
    "tumble-dryer",
    "ceiling-fan",
    "patio-heater",
    "towel-radiator",
  ];
  for (const code of Object.keys(COUNTRIES)) {
    for (const slug of slugs) {
      params.push({ country: code, slug });
    }
  }
  return params;
}

/* ──────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────── */

export default async function ProductPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country: code, slug } = await params;
  const cc = getCountry(code);

  // Query Supabase for matching product
  const { data: rows, error } = await supabase
    .from("ctc_products")
    .select("id, country_code, data, stock_status, price, image, last_checked")
    .eq("country_code", code)
    .filter("data->>slug", "eq", slug)
    .limit(1);

  if (error) {
    console.error("Supabase query error:", error);
  }

  const row = rows?.[0];

  if (!row) {
    // Attempt fallback: check if slug is a generic slug like "portable-air-conditioner"
    // and render a placeholder rather than 404
    const isGeneric = [
      "portable-air-conditioner",
      "dehumidifier",
      "air-purifier",
      "tower-fan",
      "pedestal-fan",
      "evaporative-cooler",
      "oil-radiator",
      "electric-blanket",
      "smart-thermostat",
      "fridge-freezer",
      "chest-freezer",
      "wine-cooler",
      "mini-fridge",
      "tumble-dryer",
      "ceiling-fan",
      "patio-heater",
      "towel-radiator",
    ].includes(slug);

    if (isGeneric) {
      return renderGenericProductPage(code, cc, slug);
    }
    notFound();
  }

  const raw = row.data as Record<string, unknown>;
  const offers = (raw.offers as Offer[]) || [];
  const specs = (raw.specs as ProductSpecs) || {};
  const editorial = (raw.editorial as Editorial) || {
    pros: [],
    cons: [],
    verdict: "",
    rating: 0,
  };
  const name = (raw.name as string) || slug;
  const brand = (raw.brand as string) || "";
  const image = (raw.image as string) || row.image || "";
  const displayPrice = row.price ?? 0;

  // Separate Amazon & eBay offers
  const amazonOffer = offers.find((o) => o.retailer.id === "amazon");
  const ebayOffer = offers.find((o) => o.retailer.id === "ebay");

  // "Also consider" — other products in same country
  const { data: alternatives } = await supabase
    .from("ctc_products")
    .select("id, data, price, stock_status")
    .eq("country_code", code)
    .neq("id", row.id)
    .limit(4);

  // ─── Stars renderer ───
  function Stars({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="inline-flex items-center gap-0.5 text-lg" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) return <span key={i} className="text-brand">★</span>;
          if (i === full && half) return <span key={i} className="text-brand">★</span>;
          return <span key={i} className="text-foreground/20">★</span>;
        })}
        <span className="ml-2 text-sm font-semibold text-foreground/60">{rating.toFixed(1)}</span>
      </span>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      {/* Back link */}
      <Link
        href={`/${code}`}
        className="eyebrow mb-8 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      {/* ── Hero section: image + identity ── */}
      <div className="ouac-grid mb-10 grid gap-8 border border-line bg-surface p-6 md:grid-cols-2 md:p-10">
        {/* Left: Image */}
        <div className="flex items-center justify-center bg-surface-cool p-6">
          {image ? (
            <img
              src={image}
              alt={name}
              className="max-h-72 w-full object-contain"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center text-foreground/30">
              <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Right: Identity + prices */}
        <div className="flex flex-col justify-center gap-4">
          <div>
            {brand && <p className="eyebrow text-brand">{brand}</p>}
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              {name}
            </h1>
          </div>

          {/* Star rating */}
          {editorial.rating > 0 && <Stars rating={editorial.rating} />}

          {/* Stock status badge */}
          <div className="flex items-center gap-3">
            <StatusLed status={row.stock_status as StockStatus} live />
            <span className="text-sm text-foreground/50 tnum">
              Last checked: {formatLastChecked(row.last_checked)}
            </span>
          </div>

          {/* Price comparison — Amazon vs eBay */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {amazonOffer && (
              <BuyButton
                label={`Amazon ${cc.amazonMarketplace.replace("www.", "")}`}
                price={amazonOffer.price}
                url={amazonOffer.url}
                currencySymbol={cc.currencySymbol}
                status={amazonOffer.status}
                retailer="amazon"
              />
            )}
            {ebayOffer && (
              <BuyButton
                label={`eBay ${cc.name}`}
                price={ebayOffer.price}
                url={ebayOffer.url}
                currencySymbol={cc.currencySymbol}
                status={ebayOffer.status}
                retailer="ebay"
              />
            )}
          </div>

          {!amazonOffer && !ebayOffer && (
            <p className="text-sm text-foreground/50">
              Prices currently being updated. Check back soon.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ── Left column: specs + features ── */}
        <div className="lg:col-span-2 space-y-10">
          {/* Specs table */}
          <section>
            <h2 className="text-xl font-bold tracking-tight">Technical Specifications</h2>
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full text-sm">
                <tbody>
                  {specs.btu && (
                    <SpecRow label="Cooling Capacity" value={`${specs.btu.toLocaleString()} BTU`} />
                  )}
                  {specs.cooling_power_w && (
                    <SpecRow
                      label="Cooling Power"
                      value={`${specs.cooling_power_w.toLocaleString()} W`}
                    />
                  )}
                  {specs.heating_power_w && (
                    <SpecRow
                      label="Heating Power"
                      value={`${specs.heating_power_w.toLocaleString()} W`}
                    />
                  )}
                  {specs.room_size_m2 && (
                    <SpecRow label="Recommended Room Size" value={`Up to ${specs.room_size_m2} m²`} />
                  )}
                  {specs.noise_db && (
                    <SpecRow label="Noise Level" value={`${specs.noise_db} dB`} />
                  )}
                  {specs.energy_rating && (
                    <SpecRow label="Energy Rating" value={specs.energy_rating} />
                  )}
                  {specs.weight_kg && (
                    <SpecRow label="Weight" value={`${specs.weight_kg} kg`} />
                  )}
                  {specs.dimensions && (
                    <SpecRow label="Dimensions" value={specs.dimensions} />
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Features */}
          {specs.features && specs.features.length > 0 && (
            <section>
              <h3 className="text-lg font-bold tracking-tight">Key Features</h3>
              <ul className="mt-3 space-y-2">
                {specs.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-0.5 h-1.5 w-1.5 flex-none bg-brand" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Pros / Cons */}
          <section className="grid gap-6 sm:grid-cols-2">
            {editorial.pros.length > 0 && (
              <div className="border border-line bg-surface p-5">
                <h3 className="mb-3 font-bold text-instock">✓ Pros</h3>
                <ul className="space-y-2">
                  {editorial.pros.map((p, i) => (
                    <li key={i} className="text-sm text-foreground/80">{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {editorial.cons.length > 0 && (
              <div className="border border-line bg-surface p-5">
                <h3 className="mb-3 font-bold text-sold">✗ Cons</h3>
                <ul className="space-y-2">
                  {editorial.cons.map((c, i) => (
                    <li key={i} className="text-sm text-foreground/80">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Editorial verdict */}
          {editorial.verdict && (
            <section className="border-t border-line pt-6">
              <h2 className="text-xl font-bold tracking-tight">Our Verdict</h2>
              <p className="mt-4 leading-relaxed text-foreground/80">
                {editorial.verdict}
              </p>
              {editorial.rating > 0 && (
                <div className="mt-4">
                  <Stars rating={editorial.rating} />
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Right column: "Also consider" sidebar ── */}
        <aside>
          <h2 className="text-lg font-bold tracking-tight">Also Consider</h2>
          <div className="mt-4 space-y-4">
            {alternatives && alternatives.length > 0 ? (
              alternatives.map((alt) => {
                const d = alt.data as Record<string, unknown>;
                const altSlug = (d.slug as string) || "";
                // Strip country prefix for clean URL
                const cleanSlug = altSlug.replace(/^(de|uk|fr|it|es|nl|us|au|eu)-/, "");
                const altName = (d.name as string) || alt.id;
                const altBrand = (d.brand as string) || "";
                return (
                  <Link
                    key={alt.id}
                    href={`/${code}/p/${cleanSlug}`}
                    className="block border border-line bg-surface p-4 transition-colors hover:border-brand"
                  >
                    <p className="eyebrow text-brand">{altBrand}</p>
                    <p className="mt-1 text-sm font-semibold leading-snug">
                      {altName}
                    </p>
                    {alt.price != null && (
                      <p className="mt-2 tnum text-sm font-bold">
                        {cc.currencySymbol}
                        {alt.price.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-2">
                      <StatusLed status={(alt.stock_status as StockStatus) || "in_stock"} showLabel />
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-sm text-foreground/50">No alternatives available yet.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Disclosure */}
      <section className="mt-12 border-t border-line pt-8 text-center text-xs text-foreground/40">
        Prices last updated{" "}
        {formatLastChecked(row.last_checked)}. We earn a commission on purchases made through our
        links at no extra cost to you.{" "}
        <Link href={`/${code}/disclosure`} className="underline hover:text-brand">
          Learn more
        </Link>
        .
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-line last:border-b-0">
      <td className="px-4 py-3 font-semibold text-foreground/60">{label}</td>
      <td className="px-4 py-3 tnum text-right font-medium">{value}</td>
    </tr>
  );
}

function BuyButton({
  label,
  price,
  url,
  currencySymbol,
  status,
  retailer,
}: {
  label: string;
  price: number;
  url: string;
  currencySymbol: string;
  status: StockStatus;
  retailer: "amazon" | "ebay";
}) {
  const disabled = status === "out_of_stock";
  const isEbay = retailer === "ebay";
  return (
    <a
      href={disabled ? undefined : url}
      target="_blank"
      rel="noopener sponsored nofollow"
      className={`block border p-4 text-center transition-colors ${
        disabled
          ? "border-line bg-surface-cool opacity-50 pointer-events-none"
          : "border-line bg-surface hover:border-brand"
      }`}
    >
      <p className="eyebrow text-foreground/50">{label}</p>
      <p className="mt-1 text-2xl font-bold tnum">
        {currencySymbol}
        {price.toFixed(2)}
      </p>
      <span
        className={`mt-2 inline-block px-4 py-1 text-xs font-bold text-white ${
          disabled ? "bg-sold" : "bg-brand"
        }`}
      >
        {disabled ? "Sold out" : "Buy now →"}
      </span>
    </a>
  );
}

function formatLastChecked(iso: string | null | undefined): string {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/* ──────────────────────────────────────────────
   Generic fallback when no DB product matches
   ────────────────────────────────────────────── */

function renderGenericProductPage(
  code: string,
  cc: ReturnType<typeof getCountry>,
  slug: string
) {
  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        {label}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        Detailed product information and pricing for {label.toLowerCase()} in {cc.name}.
        Compare live prices across {cc.amazonMarketplace} and eBay.
      </p>

      <div className="mt-10">
        <p className="py-10 text-center text-foreground/50">
          Product details loading from our database. Prices in {cc.currencySymbol}.
        </p>
      </div>
    </div>
  );
}
