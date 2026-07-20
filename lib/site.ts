// Single source of truth for the legal / contact identity shown across the site.
// Edit these in one place — the privacy, terms, contact, about pages and footer
// all read from here. Keep it honest.

export const SITE = {
  name: "UK Air Con Tracker",
  domain: "ukaircontracker.co.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ukaircontracker.co.uk",

  // The operating company behind the site.
  company: "Policy & Play Ltd",
  companyNumber: "17253846",
  registeredAddress: "7 Cosford Drive, Bedford, MK42 0DQ, United Kingdom",

  // Public contact — the live, monitored Policy & Play inbox. (Swap to a
  // hello@ukaircontracker.co.uk alias once forwarding is set up for it.)
  contactEmail: "hello@policyandplay.co.uk",

  // Affiliate networks we monetise outbound links through. The privacy page
  // renders this list — it must name every network that can set a cookie.
  networks: ["Amazon Associates", "eBay Partner Network", "Awin"],

  // Date the legal pages were last reviewed (update when you edit them).
  legalUpdated: "13 July 2026",
} as const;
