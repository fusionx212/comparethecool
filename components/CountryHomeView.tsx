import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";
import {
  ALL_YEAR_CATEGORIES,
  CATEGORY_LABELS,
  COOLING_CATEGORIES,
  HEATING_CATEGORIES,
} from "@/lib/catalog/contract";
import type { CategorySlug } from "@/lib/types";
import { getProducts } from "@/lib/catalog/products";
import { toBestOfDTO } from "@/lib/best-of-dto";
import { categoryPhoto, resolveProductImage } from "@/lib/product-image";
import { primaryCategoryFor, isCoolingSeason } from "@/lib/season";
import { HomeTopBuys } from "@/components/HomeTopBuys";
import { CategoryShowroom } from "@/components/CategoryShowroom";
import { DigitalUpsellStrip } from "@/components/DigitalUpsell";
import {
  CATEGORY_SPEC_HINTS,
  categoryHeroPath,
} from "@/lib/category-heroes";
import type { SiteBrand } from "@/lib/site-brand";

function orderedCategories(
  code: string,
  brand: SiteBrand,
): { slug: CategorySlug; label: string; lane: string }[] {
  const coolingSeason = isCoolingSeason(code, brand);

  const primary = (coolingSeason ? COOLING_CATEGORIES : HEATING_CATEGORIES).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: coolingSeason ? "Cooling" : "Heating",
  }));
  const secondary = (coolingSeason ? HEATING_CATEGORIES : COOLING_CATEGORIES).map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: coolingSeason ? "Heating" : "Cooling",
  }));
  const yearRound = ALL_YEAR_CATEGORIES.map((slug) => ({
    slug,
    label: CATEGORY_LABELS[slug] || slug,
    lane: "All year",
  }));

  const seen = new Set<string>();
  const out: { slug: CategorySlug; label: string; lane: string }[] = [];
  for (const item of [...primary, ...yearRound, ...secondary]) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    out.push(item);
  }
  return out;
}

function showroomSpecs(
  row: Awaited<ReturnType<typeof getProducts>>[number] | undefined,
  category: string,
): { label: string; value: string }[] {
  const specs = row?.data.specs;
  const live: { label: string; value: string }[] = [];
  if (specs?.btu != null) live.push({ label: "BTU", value: specs.btu.toLocaleString() });
  if (specs?.room_size_m2 != null) {
    live.push({ label: "Room", value: `Up to ${specs.room_size_m2} m²` });
  }
  if (specs?.cooling_power_w != null) {
    live.push({ label: "Cooling", value: `${specs.cooling_power_w} W` });
  }
  if (specs?.heating_power_w != null) {
    live.push({ label: "Heating", value: `${specs.heating_power_w} W` });
  }
  if (specs?.noise_db != null) live.push({ label: "Noise", value: `${specs.noise_db} dB` });
  if (specs?.energy_rating) live.push({ label: "Energy", value: specs.energy_rating });
  if (live.length >= 2) return live.slice(0, 3);

  const hints = CATEGORY_SPEC_HINTS[category] || [];
  return hints.map((h) => ({ label: h.label, value: h.placeholder }));
}

/** Shared country home — brand selects cooling vs heating primary catalog. */
export async function renderCountryHome(code: string, brand: SiteBrand) {
  const cc = getCountry(code);
  const cats = orderedCategories(code, brand);
  const primarySlug = primaryCategoryFor(code, brand);
  const primaryLabel = CATEGORY_LABELS[primarySlug] || primarySlug;
  const topRows = await getProducts(code, primarySlug);
  const topDtos = topRows.slice(0, 3).map((p) => {
    const dto = toBestOfDTO(p, code, brand);
    if (!dto.image) dto.image = categoryPhoto(dto.category);
    return dto;
  });

  const heroProduct = topRows[0];
  const productImg = heroProduct
    ? resolveProductImage({
        image: heroProduct.image || heroProduct.data.image,
        category: primarySlug,
        amazonAsin: heroProduct.data.amazon_asin,
      })
    : null;
  const stageImage =
    productImg &&
    (productImg.includes("amazon") || productImg.includes("ebayimg"))
      ? productImg
      : categoryHeroPath(primarySlug);

  const specs = showroomSpecs(heroProduct, primarySlug);
  const toolsPrimary =
    brand === "heat"
      ? { href: `/${code}/tools/running-cost`, label: "Running-cost calculator" }
      : { href: `/${code}/tools/btu-calculator`, label: "BTU calculator" };
  const toolsSecondary =
    brand === "heat"
      ? { href: `/${code}/tools/btu-calculator`, label: "BTU calculator" }
      : { href: `/${code}/tools/running-cost`, label: "Running-cost calculator" };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 ouac-grid border border-line bg-surface p-8 md:p-10">
        <p className="eyebrow mb-2 text-foreground/60">{cc.name}</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Best {primaryLabel.toLowerCase()} in {cc.name}
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Today&apos;s top picks — choose one and check the price.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#top-buys"
            className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
          >
            Jump to top buys
          </a>
          <Link
            href={`/${code}/best/${primarySlug}`}
            className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
          >
            Full comparison
          </Link>
        </div>
      </div>

      <HomeTopBuys
        code={code}
        currencySymbol={cc.currencySymbol}
        marketplaceHint={cc.amazonMarketplace.replace("www.", "")}
        categorySlug={primarySlug}
        categoryLabel={primaryLabel}
        products={topDtos}
      />

      <div className="mt-10">
        <CategoryShowroom
          title={heroProduct?.data.name || primaryLabel}
          subtitle={
            heroProduct
              ? `Example from today’s ${primaryLabel.toLowerCase()} shortlist`
              : `Explore ${primaryLabel.toLowerCase()}`
          }
          imageSrc={stageImage}
          imageAlt={heroProduct?.data.name || primaryLabel}
          specs={specs}
        />
      </div>

      <div className="mt-10">
        <DigitalUpsellStrip
          country={code}
          category={primarySlug}
          currencySymbol={cc.currencySymbol}
        />
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Browse categories</h2>
        <p className="mt-2 text-sm text-foreground/60">
          One tap into a list · one tap to buy
        </p>
        <div className="mt-6 grid gap-0 border border-line sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${code}/best/${cat.slug}`}
              className="group border-b border-line last:border-b-0 sm:odd:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n+1)]:border-l-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryHeroPath(cat.slug)}
                alt=""
                className="aspect-[4/3] w-full object-cover bg-surface-cool"
                loading="lazy"
              />
              <span className="flex items-center justify-between px-5 py-4">
                <span>
                  <span className="eyebrow text-foreground/40">{cat.lane}</span>
                  <span className="mt-1 block font-bold group-hover:text-brand">{cat.label}</span>
                </span>
                <span className="text-sm text-foreground/50">Shop →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight">Tools &amp; info</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={toolsPrimary.href}
            className="border border-line bg-surface px-5 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
          >
            {toolsPrimary.label}
          </Link>
          <Link
            href={toolsSecondary.href}
            className="border border-line bg-surface px-5 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
          >
            {toolsSecondary.label}
          </Link>
          <Link
            href={`/${code}/blog`}
            className="border border-line bg-surface px-5 py-3 text-sm font-semibold hover:border-brand hover:text-brand"
          >
            Guides
          </Link>
          <Link
            href={`/${code}/disclosure`}
            className="border border-line bg-surface px-5 py-3 text-sm font-semibold text-foreground/60 hover:border-brand hover:text-brand"
          >
            Disclosure
          </Link>
        </div>
      </section>
    </div>
  );
}

export function countryStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}
