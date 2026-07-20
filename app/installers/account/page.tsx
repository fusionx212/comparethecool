"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function InstallerAccountContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [installer, setInstaller] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const statusParam = searchParams.get("status");
  const sessionId = searchParams.get("session_id");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/installers/lookup?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setInstaller(data.installer);
      setLeads(data.leads || []);
      setLoggedIn(true);
    } catch (err: any) {
      setError(err.message || "Installer not found. Check your email or register first.");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="text-2xl font-bold">Installer account</h1>
        <p className="mt-2 text-sm text-foreground/60">Enter your registered email to view your account.</p>

        {statusParam === "success" && (
          <div className="mt-4 border border-instock bg-[#f0fdf4] px-4 py-3 text-sm">
            Payment successful! Your credits have been added. Sign in below to see your balance.
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="james@coolbreeze.co.uk"
              className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
            />
          </div>
          {error && <div className="border border-sold bg-[#fef2f2] px-4 py-3 text-sm text-sold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-foreground bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand disabled:opacity-50"
          >
            {loading ? "Looking up..." : "View account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-foreground/40">
          Not registered?{" "}
          <Link href="/installers" className="text-brand hover:underline">Sign up here</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl font-bold">{installer.company}</h1>
      <p className="text-sm text-foreground/50">{installer.email}</p>

      {/* Credit balance */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border rule-strong bg-surface p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-foreground/50">Credits</div>
          <div className="mt-1 text-3xl font-bold tabular-nums text-brand-deep">{installer.credits}</div>
          <div className="text-xs text-foreground/40">remaining</div>
        </div>
        <div className="border rule-strong bg-surface p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-foreground/50">Leads claimed</div>
          <div className="mt-1 text-3xl font-bold tabular-nums">{leads.filter((l: any) => l.status === "claimed" || l.status === "won").length}</div>
          <div className="text-xs text-foreground/40">total</div>
        </div>
        <div className="border rule-strong bg-surface p-5 text-center">
          <div className="text-xs uppercase tracking-wider text-foreground/50">Status</div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className={`inline-block h-3 w-3 ${installer.active ? "bg-instock" : "bg-sold"}`} />
            <span className="text-lg font-bold">{installer.active ? "Active" : "Inactive"}</span>
          </div>
          <div className="text-xs text-foreground/40">{installer.trial_used ? "Post-trial" : "Free trial"}</div>
        </div>
      </div>

      {/* Buy credits */}
      <div className="mt-6">
        <Link
          href={`/installers/buy-credits?id=${installer.id}&email=${encodeURIComponent(installer.email)}`}
          className="inline-block border border-foreground bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand"
        >
          Buy more credits
        </Link>
      </div>

      {/* Postcode coverage */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Coverage</h2>
        <p className="mt-2 text-sm text-foreground/60">
          {installer.postcode_areas?.sort().join(", ") || "None set"}
        </p>
      </div>

      {/* Lead history */}
      <div className="mt-8">
        <h2 className="text-lg font-bold">Lead history</h2>
        {leads.length === 0 ? (
          <p className="mt-2 text-sm text-foreground/50">No leads yet. They&apos;ll appear here as they come in.</p>
        ) : (
          <div className="mt-4 overflow-x-auto border rule-strong">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Postcode</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase hidden sm:table-cell">Scope</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y rule-strong">
                {leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-surface-cool">
                    <td className="px-3 py-2 text-xs text-foreground/50 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{lead.postcode}</td>
                    <td className="px-3 py-2 text-foreground/60 hidden sm:table-cell">{lead.rooms || "—"}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase ${
                        lead.status === "claimed" ? "bg-instock text-background" :
                        lead.status === "won" ? "bg-instock text-background" :
                        lead.status === "lost" ? "bg-sold text-background" :
                        "bg-line text-foreground/50"
                      }`}>{lead.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InstallerAccountPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <InstallerAccountContent />
    </Suspense>
  );
}
