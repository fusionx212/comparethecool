import { COUNTRIES, getCountry } from "@/lib/countries";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_ARTICLES, articleBySlug } from "@/lib/catalog/articles";

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  const params: { country: string; slug: string }[] = [];
  for (const code of Object.keys(COUNTRIES)) {
    for (const a of SEED_ARTICLES) {
      params.push({ country: code, slug: a.slug });
    }
  }
  return params;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ country: string; slug: string }>;
}) {
  const { country: code, slug } = await params;
  const cc = getCountry(code);
  const article = articleBySlug(code, slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link href={`/${code}/blog`} className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand">
        ← All articles — {cc.name}
      </Link>

      <p className="eyebrow text-foreground/40">{article.published_at}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{article.title}</h1>
      <p className="mt-3 text-foreground/70">{article.excerpt}</p>

      <div className="mt-10 space-y-4 text-foreground/80">
        {article.body.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>

      {article.category && (
        <Link
          href={`/${code}/best/${article.category}`}
          className="mt-10 inline-block bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          Compare products →
        </Link>
      )}
    </article>
  );
}
