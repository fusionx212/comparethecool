import { renderCountryHome, countryStaticParams } from "@/components/CountryHomeView";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  return countryStaticParams();
}

/** comparetheheat.com — heating-first catalog (rewritten from /{country}) */
export default async function HeatCountryHome({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: code } = await params;
  return renderCountryHome(code, "heat");
}
