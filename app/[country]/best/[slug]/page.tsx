import type { Metadata } from "next";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { CATEGORY_SLUGS, slugLabel } from "@/lib/catalog/contract";
import { BestOfView } from "@/components/BestOfView";
import { getReviewContent } from "@/lib/reviews";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const code of Object.keys(COUNTRIES)) {
    for (const slug of CATEGORY_SLUGS) {
      params.push({ country: code, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}): Promise<Metadata> {
  const { country, slug } = await params;
  const cc = getCountry(country);
  const review = getReviewContent(country, slug);
  const label = slugLabel(slug);
  return {
    title: review?.title || `Best ${label} in ${cc.name}`,
    description:
      review?.intro?.[0] ||
      `Compare the best ${label.toLowerCase()} in ${cc.name} with Amazon and eBay prices.`,
  };
}

export default async function BestReviewPage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country, slug } = await params;
  return <BestOfView code={country} slug={slug} />;
}
