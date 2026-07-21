/** Default electricity unit rates (local currency / kWh) for running-cost tool. */

export const ENERGY_RATES: Record<
  string,
  { rate: number; currency: string; label: string }
> = {
  uk: { rate: 0.24, currency: "GBP", label: "UK typical unit rate" },
  de: { rate: 0.32, currency: "EUR", label: "DE typical household rate" },
  fr: { rate: 0.25, currency: "EUR", label: "FR typical rate" },
  it: { rate: 0.28, currency: "EUR", label: "IT typical rate" },
  es: { rate: 0.22, currency: "EUR", label: "ES typical rate" },
  nl: { rate: 0.30, currency: "EUR", label: "NL typical rate" },
  us: { rate: 0.16, currency: "USD", label: "US average residential" },
  au: { rate: 0.30, currency: "AUD", label: "AU typical rate" },
  eu: { rate: 0.28, currency: "EUR", label: "EU average" },
};
