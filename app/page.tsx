import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        Compare the Cool
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
        Expert reviews and live price comparison for cooling, heating, and air quality products — across Europe, the UK, US, and Australia.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/uk" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇬🇧 United Kingdom</Link>
        <Link href="/de" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇩🇪 Deutschland</Link>
        <Link href="/fr" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇫🇷 France</Link>
        <Link href="/it" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇮🇹 Italia</Link>
        <Link href="/es" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇪🇸 España</Link>
        <Link href="/us" className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:brightness-110">🇺🇸 United States</Link>
      </div>
      <p className="mt-8 text-sm text-foreground/50">Coming soon: in-depth reviews, live price comparison, and buying guides for every country</p>
    </div>
  );
}
