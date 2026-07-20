"use client";

import { useState } from "react";

// UK postcode area prefixes
const UK_AREAS = [
  "AB", "AL", "B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "CA",
  "CB", "CF", "CH", "CM", "CO", "CR", "CT", "CV", "CW", "DA", "DD", "DE",
  "DG", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EH", "EN", "EX", "FK",
  "FY", "G", "GL", "GU", "HA", "HD", "HG", "HP", "HR", "HS", "HU", "HX",
  "IG", "IP", "IV", "KA", "KT", "KW", "KY", "L", "LA", "LD", "LE", "LL",
  "LN", "LS", "LU", "M", "ME", "MK", "ML", "N", "NE", "NG", "NN", "NP",
  "NR", "NW", "OL", "OX", "PA", "PE", "PH", "PL", "PO", "PR", "RG", "RH",
  "RM", "S", "SA", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", "SR",
  "SS", "ST", "SW", "SY", "TA", "TD", "TF", "TN", "TQ", "TR", "TS", "TW",
  "UB", "W", "WA", "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO", "ZE",
];

export function InstallerSignupForm() {
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    website: "",
    fgas_reg: "",
    postcode_areas: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      postcode_areas: prev.postcode_areas.includes(area)
        ? prev.postcode_areas.filter((a) => a !== area)
        : [...prev.postcode_areas, area],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.postcode_areas.length === 0) {
      setError("Select at least one postcode area you cover.");
      return;
    }
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/installers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="border rule-strong bg-surface p-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-instock">
          <svg viewBox="0 0 20 16" className="h-5 w-5 fill-background">
            <path d="M18.5 1.5L7 14.5 1.5 8.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
          </svg>
        </div>
        <h3 className="text-lg font-bold">Registration received</h3>
        <p className="mt-3 text-sm text-foreground/70 max-w-md mx-auto">
          We&rsquo;ll review your details and activate your account within 24 hours. You&rsquo;ll receive an email at <strong>{form.email}</strong> when you&rsquo;re live — then leads start flowing.
        </p>
        <p className="mt-4 text-xs text-foreground/40">
          First 3 leads are free — no payment needed to start.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rule-strong bg-surface p-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Company name *
          </label>
          <input
            name="company"
            type="text"
            required
            value={form.company}
            onChange={handleChange}
            placeholder="CoolBreeze AC Ltd"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Contact name *
          </label>
          <input
            name="contact"
            type="text"
            required
            value={form.contact}
            onChange={handleChange}
            placeholder="James Wilson"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="james@coolbreeze.co.uk"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Phone *
          </label>
          <input
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="020 7123 4567"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Website
          </label>
          <input
            name="website"
            type="url"
            value={form.website}
            onChange={handleChange}
            placeholder="https://coolbreeze.co.uk"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            F-Gas registration
          </label>
          <input
            name="fgas_reg"
            type="text"
            value={form.fgas_reg}
            onChange={handleChange}
            placeholder="FGAS-2024-12345"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      {/* Postcode areas */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
          Postcode areas you cover * <span className="font-normal normal-case tracking-normal text-foreground/40">(select all that apply)</span>
        </label>
        <div className="border rule-strong bg-background p-4 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
            {UK_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                className={`px-2 py-1 text-xs text-center border ${
                  form.postcode_areas.includes(area)
                    ? "border-brand bg-brand text-background"
                    : "border-line bg-surface hover:border-brand/30"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        {form.postcode_areas.length > 0 && (
          <p className="mt-2 text-xs text-foreground/50">
            Selected: {form.postcode_areas.sort().join(", ")}
          </p>
        )}
      </div>

      {/* Pricing info */}
      <div className="mt-6 border rule-strong bg-surface-cool p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Pricing</h4>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
          <div><span className="font-semibold">Single room:</span> £25/lead</div>
          <div><span className="font-semibold">Multi-room:</span> £35/lead</div>
          <div><span className="font-semibold">Whole house / commercial:</span> £50/lead</div>
        </div>
        <p className="mt-2 text-xs text-foreground/50">
          First 3 leads free. No monthly fees. Pay only for leads you claim. Cancel anytime.
        </p>
      </div>

      {error && (
        <div className="mt-4 border border-sold bg-[#fef2f2] px-4 py-3 text-sm text-sold">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-start gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="border border-foreground bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-background hover:border-brand hover:bg-brand disabled:opacity-50"
        >
          {status === "submitting" ? "Registering..." : "Register as installer"}
        </button>
        <p className="text-xs text-foreground/40 pt-1">
          We&rsquo;ll review and activate your account within 24h.
        </p>
      </div>
    </form>
  );
}
