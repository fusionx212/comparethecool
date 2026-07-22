"use client";

import { useEffect, useState } from "react";

/**
 * Polls order status then exposes the capability-token download once paid/fulfilled.
 * Token is fetched from a status endpoint scoped to the Stripe session (server confirms).
 */
export function ThanksDownload({
  sessionId,
  country,
}: {
  sessionId: string;
  country: string;
}) {
  const [href, setHref] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      tries += 1;
      try {
        const res = await fetch(
          `/api/digital/status?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = (await res.json()) as {
          status?: string;
          download_url?: string | null;
          error?: string;
        };
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Could not load order");
          setStatus("error");
          return;
        }
        setStatus(data.status || "pending");
        if (data.download_url) {
          setHref(data.download_url);
          return;
        }
        if (tries < 12 && (data.status === "pending" || data.status === "paid")) {
          setTimeout(poll, 1500);
        }
      } catch {
        if (!cancelled) setError("Network error");
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mt-8 border border-line bg-surface p-6">
      <p className="eyebrow text-foreground/50">Order {sessionId.slice(0, 12)}…</p>
      <p className="mt-2 text-sm capitalize text-foreground/70">Status: {status}</p>
      {href ? (
        <a
          href={href}
          className="mt-6 inline-flex bg-brand px-5 py-3 text-sm font-bold text-white hover:brightness-110"
        >
          Download PDF
        </a>
      ) : (
        <p className="mt-4 text-sm text-foreground/55">
          Waiting for payment confirmation…
          {country ? ` (${country.toUpperCase()})` : ""}
        </p>
      )}
      {error && <p className="mt-3 text-sm text-sold">{error}</p>}
    </div>
  );
}
