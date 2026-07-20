import { supabaseAdmin } from "@/lib/supabase";
import { BUDGET_LABELS, TIMELINE_LABELS, type Lead, type Installer } from "@/lib/leads";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const supabase = supabaseAdmin();

  // Fetch leads (last 50)
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch installers
  const { data: installers } = await supabase
    .from("installers")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch webhook logs
  const { data: logs } = await supabase
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const leadsList = (leads || []) as Lead[];
  const installersList = (installers || []) as Installer[];

  const statusCounts = {
    new: leadsList.filter((l) => l.status === "new").length,
    routed: leadsList.filter((l) => l.status === "routed").length,
    claimed: leadsList.filter((l) => l.status === "claimed").length,
    won: leadsList.filter((l) => l.status === "won").length,
    lost: leadsList.filter((l) => l.status === "lost").length,
  };

  const installerMap = new Map(installersList.map((i) => [i.id, i]));

  return (
    <div>
      <section className="border-b rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow text-brand-deep">Admin</div>
              <h1 className="mt-2 text-3xl font-bold leading-tight">Installation Leads</h1>
            </div>
            <Link
              href="/installers"
              className="border border-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:border-brand hover:text-brand"
            >
              Installer page
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
            <Stat label="New" value={statusCounts.new} color="brand" />
            <Stat label="Routed" value={statusCounts.routed} color="drop" />
            <Stat label="Claimed" value={statusCounts.claimed} color="instock" />
            <Stat label="Won" value={statusCounts.won} color="instock" />
            <Stat label="Lost" value={statusCounts.lost} color="sold" />
          </div>
        </div>
      </section>

      {/* Leads table */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border rule-strong text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Postcode</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Scope</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Budget</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Timeline</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Installer</th>
                </tr>
              </thead>
              <tbody className="divide-y rule-strong">
                {leadsList.map((lead) => {
                  const installer = lead.installer_id ? installerMap.get(lead.installer_id) : null;
                  const date = new Date(lead.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <tr key={lead.id} className="hover:bg-surface-cool">
                      <td className="px-3 py-2 text-xs tabular-nums text-foreground/50 whitespace-nowrap">{date}</td>
                      <td className="px-3 py-2 font-medium">{lead.name}</td>
                      <td className="px-3 py-2 tabular-nums">{lead.postcode}</td>
                      <td className="px-3 py-2 text-foreground/60 hidden sm:table-cell">{lead.rooms || "—"}</td>
                      <td className="px-3 py-2 text-foreground/60 hidden md:table-cell">
                        {lead.budget_range ? (BUDGET_LABELS[lead.budget_range] || lead.budget_range) : "—"}
                      </td>
                      <td className="px-3 py-2 text-foreground/60 hidden md:table-cell">
                        {lead.timeline ? (TIMELINE_LABELS[lead.timeline] || lead.timeline) : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-3 py-2 text-xs text-foreground/60 hidden lg:table-cell">
                        {installer ? installer.company : "—"}
                      </td>
                    </tr>
                  );
                })}
                {leadsList.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-8 text-center text-sm text-foreground/40">
                      No leads yet. The funnel is live — leads will appear here as they come in.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Installers table */}
      <section className="border-t rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-6">
          <h2 className="text-xl font-bold leading-tight">Installers ({installersList.length})</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border rule-strong text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Areas</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Credits</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y rule-strong">
                {installersList.map((inst) => (
                  <tr key={inst.id} className="hover:bg-surface-cool">
                    <td className="px-3 py-2 font-medium">{inst.company}</td>
                    <td className="px-3 py-2">{inst.contact}</td>
                    <td className="px-3 py-2 text-xs text-foreground/60 hidden sm:table-cell">{inst.email}</td>
                    <td className="px-3 py-2 text-xs text-foreground/60 hidden md:table-cell">
                      {inst.postcode_areas?.slice(0, 6).join(", ")}{(inst.postcode_areas?.length || 0) > 6 ? ` +${inst.postcode_areas.length - 6}` : ""}
                    </td>
                    <td className="px-3 py-2 tabular-nums">{inst.credits} {!inst.trial_used && <span className="text-brand text-xs ml-1">(trial)</span>}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block h-2 w-2 ${inst.active ? "bg-instock" : "bg-sold"}`} />
                      <span className="ml-1.5 text-xs text-foreground/50">{inst.active ? "Active" : "Inactive"}</span>
                    </td>
                  </tr>
                ))}
                {installersList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-foreground/40">
                      No installers registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Webhook logs */}
      <section className="border-t rule-strong">
        <div className="mx-auto max-w-6xl px-5 py-6">
          <h2 className="text-xl font-bold leading-tight">Stripe webhook log</h2>
          <p className="mt-1 text-xs text-foreground/50">Last 20 events — real-time payment tracking.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse border rule-strong text-sm">
              <thead>
                <tr className="bg-foreground text-background">
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Event</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Installer</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wider">Credits</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y rule-strong">
                {(logs || []).map((log: any) => (
                  <tr key={log.id} className="hover:bg-surface-cool">
                    <td className="px-3 py-2 text-xs text-foreground/50 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-3 py-2 text-xs">{log.event_type}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block px-1.5 py-0.5 text-xs font-semibold uppercase ${
                        log.status === "processed" ? "bg-instock text-background" :
                        log.status === "received" ? "bg-drop text-background" :
                        "bg-sold text-background"
                      }`}>{log.status}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-foreground/60 hidden sm:table-cell font-mono">
                      {log.installer_id ? log.installer_id.substring(0, 8) + "..." : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-right tabular-nums">
                      {log.credits_added != null ? `+${log.credits_added}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-sold hidden md:table-cell max-w-[200px] truncate">
                      {log.error_message || "—"}
                    </td>
                  </tr>
                ))}
                {(!logs || logs.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-sm text-foreground/40">
                      No webhook events yet. Events appear here when Stripe sends them.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="border rule-strong bg-surface p-3 text-center">
      <div className="text-2xl font-bold tabular-nums" style={{ color: `var(--${color})` }}>{value}</div>
      <div className="text-xs text-foreground/50 mt-0.5">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-brand text-background",
    routed: "bg-drop text-background",
    claimed: "bg-instock text-background",
    won: "bg-instock text-background",
    lost: "bg-sold text-background",
    invalid: "bg-line text-foreground/50",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase ${colors[status] || "bg-line"}`}>
      {status}
    </span>
  );
}
