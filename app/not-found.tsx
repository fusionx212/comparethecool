import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 text-center">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
        This page could not be found. It may have moved or been removed.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-none bg-brand px-6 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
