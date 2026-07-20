import type { Faq } from "@/lib/seo-copy";

// Question-shaped content + FAQPage schema. Google retired the FAQ *rich result*
// (Jan 2026) but FAQPage markup remains a primary signal for AI Mode extraction.
export function FaqSection({ faqs, heading = "Common questions" }: { faqs: Faq[]; heading?: string }) {
  if (!faqs.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className="mt-12 border-t border-line pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="eyebrow text-brand-deep">FAQ</div>
      <h2 className="mt-1 text-xl font-semibold">{heading}</h2>
      <dl className="mt-6 border-y border-line">
        {faqs.map((f) => (
          <div key={f.q} className="border-b border-line py-5 last:border-b-0">
            <dt className="font-medium">{f.q}</dt>
            <dd className="mt-2 max-w-2xl text-sm text-foreground/70">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
