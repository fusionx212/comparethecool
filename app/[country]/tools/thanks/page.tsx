import Link from "next/link";
import { COUNTRIES, getCountry } from "@/lib/countries";
import { ThanksDownload } from "@/components/ThanksDownload";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export default async function ThanksPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { country } = await params;
  const { session_id: sessionId } = await searchParams;
  const cc = getCountry(country);

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <Link href={`/${country}`} className="eyebrow text-foreground/50 hover:text-brand">
        ← {cc.name}
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Thanks — your PDF is ready</h1>
      <p className="mt-3 text-foreground/70">
        Payment confirmed. Download your branded companion below. We also email the
        link when live mode + Resend are configured.
      </p>
      {sessionId ? (
        <ThanksDownload sessionId={sessionId} country={country} />
      ) : (
        <p className="mt-8 text-sm text-sold">Missing session — check your email receipt.</p>
      )}
    </div>
  );
}
