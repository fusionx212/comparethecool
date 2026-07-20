import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portable Air Conditioner in Stock UK — Find One Now | UK Air Con Tracker",
  description: "Looking for a portable air conditioner in stock right now? We track live stock across Amazon, Screwfix, B&Q, Argos, Currys and more — updated every hour.",
  alternates: { canonical: "/guides/find-portable-air-conditioner-in-stock" },
};

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <nav className="eyebrow text-foreground/45">
        <Link href="/" className="hover:text-brand">Home</Link> / Guides / Find a Portable Air Conditioner in Stock
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
        How to Find a Portable Air Conditioner in Stock — UK 2026
      </h1>

      <p className="mt-4 text-base text-foreground/70">
        Every UK heatwave follows the same pattern: temperatures hit 30°C, and within 48 hours every portable air conditioner in stock sells out nationwide. We track live inventory across every major UK retailer so you can find one <em>before</em> the panic.
      </p>

      <div className="mt-6 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">💰 The money-saving truth:</p>
        <p className="mt-2 text-sm text-foreground/70">
          Portable ACs rarely go on sale during summer — demand is too high. The best time to buy is March–May when retailers clear warehouse space. But when a heatwave hits, the question isn&apos;t &quot;which is cheapest&quot; — it&apos;s &quot;which one is actually <strong>in stock</strong>.&quot;
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold">Where to Check for Stock — Ranked by Reliability</h2>

      <div className="mt-6 space-y-4">
        <StockItem
          num={1}
          retailer="Amazon UK"
          tip="Biggest range. Stock updates in real time, but popular models vanish in hours. Check the 'In Stock' badge on the listing page — 'Usually dispatched within 1-2 days' means they're running low."
          link="/portable-air-conditioners"
        />
        <StockItem
          num={2}
          retailer="Screwfix"
          tip="Physical stores often have stock when the website shows zero. Use 'Click & Collect' to reserve a unit — it holds the item for 24 hours at your local branch."
        />
        <StockItem
          num={3}
          retailer="B&Q"
          tip="Large-format stores carry a surprising range of portable ACs and air coolers. Check 'Store Availability' on the product page rather than trusting the 'Home Delivery' status."
        />
        <StockItem
          num={4}
          retailer="Argos"
          tip="Reserve online for same-day pickup. Argos updates stock by store location — a nearby branch may have units when national delivery is out."
        />
        <StockItem
          num={5}
          retailer="Currys"
          tip="Better for premium brands (De&apos;Longhi, Meaco). Currys&apos; stock system is reliable, but prices are typically £20-50 higher than Amazon."
        />
      </div>

      <h2 className="mt-10 text-xl font-bold">The Models That Restock Fastest</h2>
      <p className="mt-3 text-sm text-foreground/70">
        These are the portable air conditioners that retailers prioritise for restocking during summer — if you see one available, buy it immediately.
      </p>

      <div className="mt-6 overflow-x-auto border rule-strong">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-foreground text-background">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Model</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">BTU</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase hidden sm:table-cell">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase hidden md:table-cell">Restock Speed</th>
            </tr>
          </thead>
          <tbody className="divide-y rule-strong">
            <RestockRow model="MeacoCool MC Series 9000" btu="9,000" price="£280-330" speed="Weekly — most reliable" />
            <RestockRow model="De&apos;Longhi Pinguino PAC EL98" btu="9,800" price="£440-500" speed="Bi-weekly" />
            <RestockRow model="Pro Breeze 9000 BTU" btu="9,000" price="£250-300" speed="Bi-weekly — sells out fast" />
            <RestockRow model="AEG ChillFlex Pro" btu="9,000" price="£340-390" speed="Every 2-3 weeks" />
            <RestockRow model="Black+Decker BPACT08WT" btu="8,000" price="£220-270" speed="Irregular — grab if you see it" />
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-bold">3 Strategies to Beat the Heatwave Rush</h2>

      <div className="mt-6 space-y-4">
        <TipBlock num={1} title="Sign up for stock alerts (free)">
          We monitor 10+ UK retailers and email you the moment a portable air conditioner comes back in stock. No spam — only alerts for products you select.{" "}
          <Link href="/alerts" className="text-brand font-semibold hover:underline">Set up alerts →</Link>
        </TipBlock>

        <TipBlock num={2} title="Check early morning (6-8am)">
          Retailers update their online inventory overnight. By 9am, the best units are gone. Set an alarm and check before breakfast during heatwave weeks.
        </TipBlock>

        <TipBlock num={3} title="Have 3 models on your shortlist">
          Don&apos;t fixate on one specific unit. Identify three portable ACs that would work for your room size, then check stock for all of them. Read our{" "}
          <Link href="/guides/best-portable-ac-under-350" className="text-brand font-semibold hover:underline">best portable AC under £350 guide</Link>{" "}
          for a curated shortlist.
        </TipBlock>
      </div>

      <div className="mt-10 border rule-strong bg-surface-cool p-5">
        <p className="text-sm font-semibold">⚠️ Avoid &quot;air coolers&quot; — they are not air conditioners</p>
        <p className="mt-2 text-sm text-foreground/70">
          Every heatwave, retailers push evaporative &quot;air coolers&quot; (£30-80) as budget alternatives. They do not cool a room — they blow damp air. If you need to actually lower the temperature, only a compressor-based portable air conditioner (with an exhaust hose) will work. Look for BTU ratings — air coolers don&apos;t have them.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold">What to Do If Everything Is Sold Out</h2>
      <p className="mt-3 text-sm text-foreground/70">
        Deep summer, no stock anywhere? You still have options:
      </p>

      <ul className="mt-4 space-y-2 text-sm text-foreground/70 list-disc pl-5">
        <li><strong>Check eBay for used units.</strong> Previous buyers often resell after a cool summer. Look for units with the original exhaust hose and window kit included.</li>
        <li><strong>Try a dehumidifier instead.</strong> Removing moisture makes 30°C feel like 27°C — it&apos;s not air conditioning, but it helps significantly in humid UK heatwaves.{" "}
          <Link href="/dehumidifiers" className="text-brand hover:underline">Dehumidifier stock →</Link></li>
        <li><strong>Build a DIY cooling setup.</strong> Our{" "}
          <Link href="/guides/heatwave-survival-kit" className="text-brand hover:underline">heatwave survival kit guide</Link>{" "}
          covers the £100 emergency setup: blackout curtains, pedestal fan, cooling mattress topper, and reflective window film.</li>
        <li><strong>Bookmark our tracker.</strong> We check stock every hour. The moment a retailer restocks, we update.{" "}
          <Link href="/" className="text-brand hover:underline">Live stock →</Link></li>
      </ul>

      <div className="mt-10 border rule-strong p-5">
        <p className="text-sm font-semibold">Why trust our stock data?</p>
        <p className="mt-2 text-sm text-foreground/70">
          UK Air Con Tracker pulls live inventory data from 10 major UK retailers using their public product APIs and store-checker tools. Stock status is refreshed hourly. We don&apos;t hold inventory — we show you what&apos;s actually available right now.{" "}
          <Link href="/how-we-track" className="text-brand hover:underline">How we track stock →</Link>
        </p>
      </div>

      <Link
        href="/portable-air-conditioners"
        className="mt-6 inline-block border border-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
      >
        Check portable air conditioner stock now →
      </Link>
    </div>
  );
}

function StockItem({ num, retailer, tip, link }: { num: number; retailer: string; tip: string; link?: string }) {
  return (
    <div className="border rule-strong p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-foreground text-xs font-bold text-background">
          {num}
        </span>
        <div>
          <h3 className="text-sm font-bold">{retailer}</h3>
          <p className="mt-1 text-sm text-foreground/70">
            {tip}{" "}
            {link && (
              <Link href={link} className="text-brand font-semibold hover:underline">
                Check stock →
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function TipBlock({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="border rule-strong p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-brand font-bold text-xs text-white">
          {num}
        </span>
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="mt-1 text-sm text-foreground/70">{children}</p>
        </div>
      </div>
    </div>
  );
}

function RestockRow({ model, btu, price, speed }: { model: string; btu: string; price: string; speed: string }) {
  return (
    <tr>
      <td className="px-4 py-3 font-semibold text-sm">{model}</td>
      <td className="px-4 py-3 text-right text-sm tabular-nums hidden sm:table-cell">{btu}</td>
      <td className="px-4 py-3 text-right text-sm tabular-nums hidden sm:table-cell">{price}</td>
      <td className="px-4 py-3 text-sm text-foreground/70 hidden md:table-cell">{speed}</td>
    </tr>
  );
}
