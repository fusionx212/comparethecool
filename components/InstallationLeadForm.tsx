"use client";

import { useState } from "react";
import Link from "next/link";

const PROPERTY_OPTIONS = [
  { value: "", label: "Property type" },
  { value: "house", label: "House" },
  { value: "flat", label: "Flat / Apartment" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop / Retail" },
  { value: "commercial", label: "Commercial / Industrial" },
];

const ROOM_OPTIONS = [
  { value: "", label: "How many rooms?" },
  { value: "single", label: "Single room" },
  { value: "2-3", label: "2–3 rooms" },
  { value: "whole", label: "Whole property" },
  { value: "commercial", label: "Commercial space" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "Budget range" },
  { value: "1000-2000", label: "£1,000 – £2,000" },
  { value: "2000-4000", label: "£2,000 – £4,000" },
  { value: "4000+", label: "£4,000+" },
  { value: "researching", label: "Just researching" },
];

const TIMELINE_OPTIONS = [
  { value: "", label: "When do you need it?" },
  { value: "asap", label: "ASAP – ready to book" },
  { value: "within-1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "browsing", label: "Just browsing" },
];

export function InstallationLeadForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    property_type: "",
    rooms: "",
    budget_range: "",
    timeline: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="border rule-strong bg-surface p-8 md:p-10">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center bg-instock">
            <svg viewBox="0 0 20 16" className="h-5 w-5 fill-background">
              <path d="M18.5 1.5L7 14.5 1.5 8.5" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Enquiry sent</h3>
          <p className="mt-3 text-sm text-foreground/70">
            We&rsquo;re matching you with local F-Gas certified installers. They&rsquo;ll contact you within 1&ndash;2 working days with quotes.
          </p>
          <p className="mt-4 text-xs text-foreground/40">
            Check your inbox at <strong>{form.email}</strong> for confirmation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rule-strong bg-surface p-8 md:p-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Your name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="John Smith"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="07123 456789"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>

        {/* Postcode */}
        <div>
          <label htmlFor="postcode" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Postcode *
          </label>
          <input
            id="postcode"
            name="postcode"
            type="text"
            required
            value={form.postcode}
            onChange={handleChange}
            placeholder="SW1A 1AA"
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>

        {/* Property type */}
        <div>
          <label htmlFor="property_type" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Property type
          </label>
          <select
            id="property_type"
            name="property_type"
            value={form.property_type}
            onChange={handleChange}
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          >
            {PROPERTY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.value === ""}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rooms */}
        <div>
          <label htmlFor="rooms" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Coverage
          </label>
          <select
            id="rooms"
            name="rooms"
            value={form.rooms}
            onChange={handleChange}
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          >
            {ROOM_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.value === ""}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="budget_range" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Budget
          </label>
          <select
            id="budget_range"
            name="budget_range"
            value={form.budget_range}
            onChange={handleChange}
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          >
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.value === ""}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
          >
            {TIMELINE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={o.value === ""}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes — full width */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
            Anything else? <span className="font-normal normal-case tracking-normal text-foreground/40">(specific brands, requirements, access notes)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={form.notes}
            onChange={handleChange}
            placeholder="e.g. Looking for a Daikin or Mitsubishi split system, top-floor flat with balcony access..."
            className="w-full border rule-strong bg-background px-3 py-2.5 text-sm placeholder:text-foreground/30 focus:border-brand focus:outline-none"
          />
        </div>
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
          {status === "submitting" ? "Sending..." : "Get free quotes"}
        </button>
        <p className="text-xs text-foreground/40 leading-relaxed pt-1">
          By submitting, you agree to be contacted by up to 3 local F-Gas certified installers. See our{" "}
          <Link href="/privacy" className="underline hover:text-brand">privacy policy</Link>.
        </p>
      </div>
    </form>
  );
}
