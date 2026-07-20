import type { Metadata } from "next";
import { InstallationLeadForm } from "@/components/InstallationLeadForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Air Conditioning Installation — Get Free Quotes | UK Air Con Tracker",
  description:
    "Get free quotes from local F-Gas certified air conditioning installers. Compare prices for split-system, multi-split and commercial AC installation across the UK.",
};

export default function InstallationPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="eyebrow text-brand-deep">Professional installation</div>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Get free quotes from local F-Gas certified AC installers
          </h1>
          <p className="mt-5 max-w-xl text-base text-foreground/70">
            From a single room to a whole office block — we match you with vetted installers in your area. No obligation, no spam, just real quotes from real professionals.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b rule-strong bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Step
              num={1}
              title="Tell us what you need"
              body="Fill in the quick form — property type, rooms, budget and timeline. Takes 60 seconds."
            />
            <Step
              num={2}
              title="We match you"
              body="Your enquiry goes to local F-Gas certified installers who cover your postcode. They see your requirements and get in touch."
            />
            <Step
              num={3}
              title="Compare quotes"
              body="You&rsquo;ll get up to 3 quotes. Compare, ask questions, pick the right installer. Zero obligation."
            />
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold leading-tight">Get started</h2>
            <p className="mt-2 text-sm text-foreground/60">
              Your details go direct to installers — never sold to a marketplace.
            </p>
            <div className="mt-8">
              <InstallationLeadForm />
            </div>
          </div>
        </div>
      </section>

      {/* Why professional install */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="text-2xl font-bold leading-tight">Portable vs professional — why go fixed?</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <CompareCard
              title="Portable unit"
              pros={["No installation needed", "Can move between rooms", "Lower upfront cost (£200–£600)"]}
              cons={[
                "Noisy (50–65 dB constantly)",
                "Less efficient — hose dumps hot air back in",
                "Takes up floor space",
                "Can only cool one room effectively",
                "3–5 year lifespan",
              ]}
            />
            <CompareCard
              title="Fixed split-system"
              pros={[
                "Near-silent operation (19–30 dB indoors)",
                "3–5× more energy efficient",
                "Heats as well as cools (year-round use)",
                "Increases property value",
                "15–20 year lifespan",
                "No floor space — wall-mounted unit",
              ]}
              cons={["Professional installation required", "Higher upfront cost (£1,500–£5,000)"]}
              highlight
            />
          </div>
          <p className="mt-8 text-sm text-foreground/50 max-w-2xl">
            A professionally installed split-system typically pays for itself within 3–5 years through energy savings alone — and that&rsquo;s before you factor in the comfort difference during a UK heatwave.
          </p>
        </div>
      </section>

      {/* Cost guide */}
      <section className="border-b rule-strong bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="text-2xl font-bold leading-tight">What does installation cost?</h2>
          <p className="mt-2 text-sm text-foreground/60">Guide prices — actual quotes depend on your property and requirements.</p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse border rule-strong">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Installation type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Typical cost</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">What&rsquo;s included</th>
                </tr>
              </thead>
              <tbody className="divide-y rule-strong">
                <CostRow type="Single split (1 room)" cost="£1,500 – £2,500" detail="1 indoor wall unit + 1 outdoor condenser. Standard install with 3m pipe run." />
                <CostRow type="Multi-split (2–3 rooms)" cost="£3,000 – £5,500" detail="2–3 indoor units connected to 1 outdoor condenser. Ideal for bedrooms + living area." />
                <CostRow type="Whole-house (4+ rooms)" cost="£5,000 – £9,000" detail="Multiple indoor units or ducted system. Full survey required." />
                <CostRow type="Commercial / office" cost="£4,000 – £20,000+" detail="Depends on floor area, ceiling type, and cooling load. Site survey essential." />
                <CostRow type="Heat pump (heating + cooling)" cost="£3,500 – £8,000" detail="Air-to-air heat pump. Eligible for government grants in some cases." />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="text-2xl font-bold leading-tight">Common questions</h2>
          <div className="mt-8 space-y-1 divide-y rule-strong">
            <Faq q="Do I need planning permission for air conditioning?" a="For most domestic installations, no. Permitted development rights usually cover external condenser units. Listed buildings and conservation areas may need consent. Your installer will advise." />
            <Faq q="What does F-Gas certified mean?" a="F-Gas certification is a legal requirement in the UK for anyone handling refrigerant gases. All installers we match you with hold valid F-Gas certification — it&rsquo;s non-negotiable." />
            <Faq q="Can a split system heat as well as cool?" a="Yes. Modern split systems are reversible heat pumps — they provide efficient heating in winter (typically 3–4× more efficient than electric heaters) and cooling in summer." />
            <Faq q="How long does installation take?" a="A standard single-split install takes 4–8 hours. Multi-room systems typically take 1–2 days. Your installer will give you a timeline during the quote." />
            <Faq q="Is there any obligation?" a="None. You&rsquo;re getting free quotes. Compare them, ask questions, and only proceed if you&rsquo;re happy with the price and installer." />
            <Faq q="Do you install yourself?" a="No — we&rsquo;re a matching service. We connect you with independent F-Gas certified installers who cover your area. We don&rsquo;t take a commission from your job." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16 text-center">
          <h2 className="text-2xl font-bold leading-tight">Ready to get quotes?</h2>
          <p className="mt-3 text-sm text-foreground/60">Free, no-obligation quotes from local F-Gas certified installers.</p>
          <div className="mt-6">
            <a
              href="#form"
              className="inline-block border border-foreground bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
            >
              Get started
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ num, title, body }: { num: number; title: string; body: string }) {
  return (
    <div>
      <div className="mb-3 flex h-8 w-8 items-center justify-center bg-foreground text-xs font-bold tracking-wider text-background">
        {num}
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-sm text-foreground/60">{body}</p>
    </div>
  );
}

function CompareCard({
  title,
  pros,
  cons,
  highlight,
}: {
  title: string;
  pros: string[];
  cons: string[];
  highlight?: boolean;
}) {
  return (
    <div className={`border rule-strong p-6 ${highlight ? "border-brand-deep bg-[#f0f9fc]" : "bg-surface"}`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider ${highlight ? "text-brand-deep" : ""}`}>{title}</h3>
      <div className="mt-4 space-y-3">
        {pros.map((p, i) => (
          <div key={`pro-${i}`} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 block h-3 w-3 flex-shrink-0 bg-instock" />
            <span className="text-foreground/80">{p}</span>
          </div>
        ))}
        {cons.map((c, i) => (
          <div key={`con-${i}`} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 block h-3 w-3 flex-shrink-0 bg-sold" />
            <span className="text-foreground/60">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostRow({ type, cost, detail }: { type: string; cost: string; detail: string }) {
  return (
    <tr className="hover:bg-surface-cool">
      <td className="px-4 py-3 text-sm font-semibold">{type}</td>
      <td className="px-4 py-3 text-sm tabular-nums font-semibold text-brand-deep">{cost}</td>
      <td className="px-4 py-3 text-sm text-foreground/60 hidden md:table-cell">{detail}</td>
    </tr>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-4">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
        {q}
        <span className="ml-4 text-foreground/30 group-open:hidden">+</span>
        <span className="ml-4 hidden text-foreground/30 group-open:inline">−</span>
      </summary>
      <p className="mt-3 text-sm text-foreground/60">{a}</p>
    </details>
  );
}
