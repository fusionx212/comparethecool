import Link from "next/link";
import { getCountry } from "@/lib/countries";
import { getProducts } from "@/lib/catalog/products";
import { slugLabel } from "@/lib/catalog/contract";
import { getReviewContent } from "@/lib/reviews";
import { BestOfClient } from "@/components/BestOfClient";
import { toBestOfDTO } from "@/lib/best-of-dto";
import { categoryPhoto } from "@/lib/product-image";

export const revalidate = 3600;

export async function BestOfView({
  code,
  slug,
}: {
  code: string;
  slug: string;
}) {
  const cc = getCountry(code);
  const label = slugLabel(slug);
  const products = await getProducts(code, slug);
  const review = getReviewContent(code, slug);
  const dtos = products.map((p) => {
    const dto = toBestOfDTO(p, code);
    if (!dto.image) dto.image = categoryPhoto(dto.category);
    return dto;
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href={`/${code}`}
        className="eyebrow mb-6 inline-block text-foreground/50 hover:text-brand"
      >
        ← Back to {cc.name}
      </Link>

      <p className="eyebrow text-brand">Best of · {cc.code.toUpperCase()}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
        {review?.title || `Best ${label} in ${cc.name}`}
      </h1>
      <p className="mt-3 max-w-3xl text-foreground/70">
        {review?.intro?.[0] ||
          `Independent picks for ${cc.name} with live catalog prices. Filter, compare, then open a deal when you are ready.`}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="#compare"
          className="bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          Jump to comparison
        </a>
        <Link
          href={`/${code}/tools/btu-calculator`}
          className="border border-foreground px-5 py-3 text-sm font-bold hover:border-brand hover:text-brand"
        >
          BTU calculator
        </Link>
      </div>

      <BestOfClient
        code={code}
        currencySymbol={cc.currencySymbol}
        marketplaceHint={cc.amazonMarketplace.replace("www.", "")}
        products={dtos}
      />

      {review?.buyingGuide && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">Buying guide</h2>
          {review.buyingGuide.map((p) => (
            <p key={p.slice(0, 24)} className="mt-3 text-foreground/75">
              {p}
            </p>
          ))}
        </section>
      )}

      {review?.faq && (
        <section className="mt-14 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-6 space-y-4">
            {review.faq.map((f) => (
              <details key={f.question} className="border border-line bg-surface p-4">
                <summary className="cursor-pointer font-semibold">{f.question}</summary>
                <p className="mt-2 text-sm text-foreground/70">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="text-xl font-bold">How we compare</h2>
        <p className="mt-3 text-foreground/70">
          Specs, verified customer feedback, and catalog prices. We are not paid for positive
          reviews — income is affiliate commission only, at no extra cost to you.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Best ${label} in ${cc.name}`,
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://comparethecool.com/${code}/p/${p.data.slug}`,
              name: p.data.name,
            })),
          }),
        }}
      />
      {review?.faq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: review.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
