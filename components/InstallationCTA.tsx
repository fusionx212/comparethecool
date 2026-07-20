import Link from "next/link";

// Compact CTA to drop into product pages and category pages
export function InstallationCTA({ variant = "inline" }: { variant?: "inline" | "banner" }) {
  if (variant === "banner") {
    return (
      <div className="border rule-strong bg-surface-cool px-5 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-sm font-semibold">Need a permanent cooling solution?</span>
            <span className="ml-2 text-sm text-foreground/60 hidden sm:inline">
              Get free quotes from local F-Gas certified installers.
            </span>
          </div>
          <Link
            href="/installation"
            className="border border-foreground bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand whitespace-nowrap"
          >
            Get quotes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border rule-strong bg-surface-cool px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-foreground">Need installation?</span>{" "}
          Get free quotes from local F-Gas certified AC installers.
        </p>
        <Link
          href="/installation"
          className="flex-shrink-0 border border-brand bg-brand px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-background hover:bg-brand-deep"
        >
          Get quotes
        </Link>
      </div>
    </div>
  );
}
