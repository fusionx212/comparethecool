import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const code of Object.keys(COUNTRIES)) {
    params.push({ country: code, slug: "getting-started" });
    params.push({ country: code, slug: "buying-guide" });
    params.push({ country: code, slug: "maintenance-tips" });
    params.push({ country: code, slug: "energy-saving" });
  }
  return params;
}

export default async function BlogArticlePage({ params }: { params: Promise<{ country: string; slug: string }> }) {
  const { country: code, slug } = await params;
  const cc = getCountry(code);

  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link
        href={`/${code}/blog`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← All articles — {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        {label}
      </h1>
      <p className="mt-3 text-foreground/70">
        Practical advice for {cc.name} shoppers. Prices in {cc.currencySymbol}.
      </p>

      <div className="mt-10">
        <p className="py-10 text-center text-foreground/50">
          Article content loading from our database.
        </p>
      </div>
    </div>
  );
}
