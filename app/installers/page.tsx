import type { Metadata } from "next";
import { InstallerSignupForm } from "@/components/InstallerSignupForm";

export const metadata: Metadata = {
  title: "Get AC Installation Leads — Join as an Installer | UK Air Con Tracker",
  description:
    "Get qualified air conditioning installation leads in your area. No monthly fees — pay only for leads you claim. First 3 leads free.",
};

export default function InstallersPage() {
  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <div className="eyebrow text-brand-deep">For installers</div>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Get qualified AC installation leads in your area
          </h1>
          <p className="mt-5 max-w-xl text-base text-foreground/70">
            We send pre-qualified installation enquiries from people actively looking for air conditioning. No monthly fees — you pay only for leads you claim.
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b rule-strong bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Prop title="Pre-qualified" body="Leads include budget, timeline, property type and scope — not just a name and number." />
            <Prop title="AC only" body="Every lead is someone looking for air conditioning. No boiler repairs, no plumbing — pure HVAC." />
            <Prop title="No monthly fees" body="Pay per lead you claim. First 3 leads free. Pause or cancel anytime. No lock-in." />
            <Prop title="Exclusive routing" body="Leads go to 2–3 installers max — not blasted to 20 competitors like general marketplaces." />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="text-2xl font-bold leading-tight">Simple pricing</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <PriceCard type="Single room" price="£25" detail="Residential single-split enquiries. Budget £1K+." />
            <PriceCard type="Multi-room" price="£35" detail="2–3 rooms or whole-floor. Budget £2K–£5K." />
            <PriceCard type="Whole house / commercial" price="£50" detail="4+ rooms or commercial premises. Budget £4K+." highlight />
          </div>
          <p className="mt-6 text-sm text-foreground/50 text-center">
            Typical close rate on pre-qualified leads: 20–30%. That&rsquo;s £83–£250 CAC on a £2,500 job.
          </p>
        </div>
      </section>

      {/* How it works for installers */}
      <section className="border-b rule-strong bg-surface-cool">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="text-2xl font-bold leading-tight">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <Step num={1} title="Register" body="Sign up in 2 minutes — tell us your company details and postcode areas." />
            <Step num={2} title="Get leads" body="When someone in your area requests quotes, we email you the lead details instantly." />
            <Step num={3} title="Claim & contact" body="Click to claim the lead (first-come, first-served) — then reach out to the customer." />
            <Step num={4} title="Close the job" body="Quote, survey, install. You keep 100% of the job revenue — we just charge for the lead." />
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold leading-tight">Join as an installer</h2>
            <p className="mt-2 text-sm text-foreground/60">
              Free to join. First 3 leads free. No monthly fees, no lock-in.
            </p>
            <div className="mt-8">
              <InstallerSignupForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Prop({ title, body }: { title: string; body: string }) {
  return (
    <div className="border rule-strong bg-surface p-5">
      <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      <p className="mt-2 text-sm text-foreground/60">{body}</p>
    </div>
  );
}

function PriceCard({ type, price, detail, highlight }: { type: string; price: string; detail: string; highlight?: boolean }) {
  return (
    <div className={`border rule-strong p-6 text-center ${highlight ? "border-brand-deep bg-[#f0f9fc]" : "bg-surface"}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50">{type}</div>
      <div className={`mt-2 text-3xl font-bold tabular-nums ${highlight ? "text-brand-deep" : ""}`}>{price}</div>
      <div className="mt-1 text-xs text-foreground/40">per lead</div>
      <p className="mt-3 text-sm text-foreground/60">{detail}</p>
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
