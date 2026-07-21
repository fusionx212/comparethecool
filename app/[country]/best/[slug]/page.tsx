// Server component wrapper — handles generateStaticParams for static export
// then delegates to the client component for live data
import { COUNTRIES } from "@/lib/countries";
import BestReviewPageClient from "./client";

const ALL_SLUGS = [
  "portable-air-conditioners",
  "dehumidifiers",
  "air-purifiers",
  "tower-fans",
  "pedestal-fans",
  "evaporative-coolers",
  "electric-blankets",
  "oil-radiators",
  "ice-makers",
  "heated-airers",
  "smart-thermostats",
  "air-quality-monitors",
];

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const code of Object.keys(COUNTRIES)) {
    for (const slug of ALL_SLUGS) {
      params.push({ country: code, slug });
    }
  }
  return params;
}

export default function BestReviewPageWrapper({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  return <BestReviewPageClient params={params} />;
}
