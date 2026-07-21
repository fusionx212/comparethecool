import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";
import { articlesForCountry } from "@/lib/catalog/articles";

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((code) => ({ country: code }));
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: code } = await params;
  const cc = getCountry(code);
  const articles = articlesForCountry(code);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link href={`/${code}`} className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand">
        ← Back to {cc.name}
      </Link>

      <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
        Blog &amp; articles — {cc.name}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        Buying guides and tips for cooling, heating, and air quality in {cc.name}.
      </p>

      <div className="mt-10 grid gap-0 border border-line">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/${code}/blog/${a.slug}`}
            className="border-b border-line bg-surface px-5 py-5 last:border-b-0 hover:bg-surface-cool"
          >
            <p className="eyebrow text-foreground/40">{a.published_at}</p>
            <h2 className="mt-1 text-lg font-bold hover:text-brand">{a.title}</h2>
            <p className="mt-1 text-sm text-foreground/65">{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
