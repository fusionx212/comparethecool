import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b rule-strong bg-surface">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <span className="block h-5 w-5 bg-brand" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-[0.18em]">Compare the Cool</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/uk" className="text-sm text-foreground/70 hover:text-brand">🇬🇧 UK</Link>
            <Link href="/de" className="text-sm text-foreground/70 hover:text-brand">🇩🇪 DE</Link>
            <Link href="/fr" className="text-sm text-foreground/70 hover:text-brand">🇫🇷 FR</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
