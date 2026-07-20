import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export function Footer() {
  return (
    <footer className="mt-20 border-t rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-4 w-4 bg-brand" aria-hidden />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">UK Air Con Tracker</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-foreground/60">
              An independent live tracker of cooling, heating, and air quality stock and prices across UK
              retailers. We don't sell anything — we point you to who has it, for less.
            </p>
          </div>
          <div>
            <div className="eyebrow text-foreground/50">Digital Guides</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/products/home-cooling-handbook" className="text-foreground/80 hover:text-brand">Cooling Handbook £4.99</Link></li>
              <li><Link href="/products/heatwave-emergency-checklist" className="text-foreground/80 hover:text-brand">Heatwave Checklist £2.99</Link></li>
              <li><Link href="/products/energy-bill-guide" className="text-foreground/80 hover:text-brand">Energy Bill Guide £4.99</Link></li>
              <li><Link href="/products/home-maintenance-logbook" className="text-foreground/80 hover:text-brand">Maintenance Logbook £7.99</Link></li>
              <li><Link href="/products/holiday-let-welcome-book" className="text-foreground/80 hover:text-brand">Holiday Let Welcome Book £14.99</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow text-foreground/50">Categories</div>
            <ul className="mt-4 space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-foreground/80 hover:text-brand">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="eyebrow text-foreground/50">Tools & info</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/installation" className="text-foreground/80 hover:text-brand">Installation quotes</Link></li>
              <li><Link href="/tools/btu-calculator" className="text-foreground/80 hover:text-brand">BTU calculator</Link></li>
              <li><Link href="/tools/stock-selector" className="text-foreground/80 hover:text-brand">Stock selector</Link></li>
              <li><Link href="/tools/running-cost-calculator" className="text-foreground/80 hover:text-brand">Running cost calculator</Link></li>
              <li><Link href="/alerts" className="text-foreground/80 hover:text-brand">Restock alerts</Link></li>
              <li><Link href="/how-we-track" className="text-foreground/80 hover:text-brand">How we track</Link></li>
              <li><Link href="/disclosure" className="text-foreground/80 hover:text-brand">Affiliate disclosure</Link></li>
            </ul>
          </div>
          <div>
            <div className="eyebrow text-foreground/50">Company & legal</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground/80 hover:text-brand">About</Link></li>
              <li><Link href="/contact" className="text-foreground/80 hover:text-brand">Contact</Link></li>
              <li><Link href="/privacy" className="text-foreground/80 hover:text-brand">Privacy policy</Link></li>
              <li><Link href="/terms" className="text-foreground/80 hover:text-brand">Terms of use</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-line pt-6 text-xs text-foreground/55">
          Affiliate disclosure: UK Air Con Tracker may earn a commission when you buy through our
          outbound links, at no extra cost to you. As an Amazon Associate we earn from qualifying
          purchases. Prices and stock are checked regularly but change fast in a heatwave — always
          confirm on the retailer's own site before buying.
        </p>
      </div>
    </footer>
  );
}
