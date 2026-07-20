import { getEditorialReview } from "@/lib/editorial-reviews";
import type { EditorialReview } from "@/lib/editorial-reviews";

export function EditorialReview({ productId }: { productId: string }) {
  const review = getEditorialReview(productId);
  if (!review) return null;

  return (
    <section className="mt-10 border rule-strong bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow text-brand-deep">Our verdict</div>
          <h2 className="mt-1 text-xl font-bold tracking-tight">
            {review.verdict.length > 120
              ? review.verdict.slice(0, 120) + "…"
              : review.verdict}
          </h2>
        </div>
        <ScoreBadge rating={review.rating} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        {review.verdict}
      </p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <ProConList title="What we like" items={review.pros} kind="pro" />
        <ProConList title="What we don't" items={review.cons} kind="con" />
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <span className="eyebrow text-foreground/50">Best for: </span>
        <span className="text-sm text-foreground/75">{review.bestFor}</span>
      </div>

      <div className="mt-4 text-xs text-foreground/35 italic">
        Our opinion, based on hands-on testing, user reviews, and spec comparisons.
        We may earn a commission if you buy through our links — this does not
        affect our rating.
      </div>
    </section>
  );
}

function ScoreBadge({ rating }: { rating: number }) {
  const color =
    rating >= 8 ? "var(--instock)" : rating >= 6 ? "var(--brand)" : "var(--drop)";
  const label = rating >= 8 ? "Great" : rating >= 6 ? "Good" : "Okay";

  return (
    <div
      className="flex flex-none flex-col items-center justify-center border-2 p-3"
      style={{ borderColor: color }}
    >
      <span className="tnum text-3xl font-bold" style={{ color }}>
        {rating}
      </span>
      <span className="eyebrow mt-0.5 text-foreground/45">{label}</span>
    </div>
  );
}

function ProConList({
  title,
  items,
  kind,
}: {
  title: string;
  items: string[];
  kind: "pro" | "con";
}) {
  const accent = kind === "pro" ? "var(--instock)" : "var(--drop)";
  return (
    <div>
      <div className="eyebrow" style={{ color: accent }}>
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-foreground/75">
            <span
              className="mt-1 flex-none text-xs font-bold"
              style={{ color: accent }}
            >
              {kind === "pro" ? "+" : "−"}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
