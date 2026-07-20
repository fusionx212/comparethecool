import Link from "next/link";

const AWIN_MID = "56203";
const AWIN_AFFID = "2953601";

function awinLink(productPath: string): string {
  const ued = encodeURIComponent(`https://lochelectronics.com${productPath}`);
  return `https://www.awin1.com/cread.php?awinmid=${AWIN_MID}&awinaffid=${AWIN_AFFID}&ued=${ued}`;
}

interface LochProduct {
  name: string;
  price: string;
  wasPrice?: string;
  path: string;
  badge?: string;
}

const PRODUCTS: LochProduct[] = [
  {
    name: "Capsule Dishwasher",
    price: "£339.99",
    wasPrice: "£399.99",
    path: "/products/capsule-dishwasher",
    badge: "15% off · 107 reviews · 4.7★",
  },
  {
    name: "Capsule Solo Dishwasher",
    price: "£297.49",
    wasPrice: "£349.99",
    path: "/products/capsule-solo",
    badge: "15% off · 27 reviews · 4.5★",
  },
  {
    name: "Capsule Refurbished",
    price: "from £100",
    wasPrice: "£349",
    path: "/collections/all?filter.v.price.gte=0&filter.v.price.lte=&sort_by=price-ascending",
    badge: "72% off · Refurbished",
  },
  {
    name: "Capsule Essentials Bundle",
    price: "£408.58",
    wasPrice: "£481.96",
    path: "/products/capsule-essentials-bundle",
    badge: "15% off · Dishwasher + accessories",
  },
];

export function LochCrossSell() {
  return (
    <section className="border-t border-line bg-surface-cool">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="eyebrow text-brand-deep">You might also like</div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Compact Countertop Dishwashers — Loch Electronics
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              No plumbing needed. Fits on a countertop. Perfect for small UK
              homes, flats &amp; campervans.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <a
              key={p.path}
              href={awinLink(p.path)}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="group flex flex-col border-b border-r border-line bg-surface p-5 hover:bg-surface-cool"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold group-hover:text-brand">
                  {p.name}
                </h3>
              </div>

              {p.badge && (
                <span className="mt-1.5 text-xs text-foreground/50">
                  {p.badge}
                </span>
              )}

              <div className="mt-3 flex items-baseline gap-2">
                <span className="tnum text-lg font-bold text-foreground">
                  {p.price}
                </span>
                {p.wasPrice && (
                  <span className="tnum text-sm text-foreground/40 line-through">
                    {p.wasPrice}
                  </span>
                )}
              </div>

              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand group-hover:underline">
                View Deal →
              </span>
            </a>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-foreground/45">
          Loch Electronics · Awin programme 56203 ·{" "}
          <Link href="/disclosure" className="underline hover:text-brand">
            affiliate disclosure
          </Link>
        </p>
      </div>
    </section>
  );
}
