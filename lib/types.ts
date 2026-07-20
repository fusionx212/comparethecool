// Core domain model for the tracker. Single source of truth for shapes.

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export type CategorySlug =
  | "portable-air-conditioners"
  | "air-con-units"
  | "evaporative-coolers"
  | "tower-fans"
  | "pedestal-fans"
  | "portable-fans"
  | "desk-usb-fans"
  | "dehumidifiers"
  | "air-purifiers"
  | "ice-makers"
  | "garden-parasols"
  | "cooling-bedding"
  | "dog-cooling"
  | "blackout-curtains"
  | "window-film"
  | "paddling-pools"
  | "car-sun-shades"
  | "ac-accessories"
  | "heated-airers"
  | "electric-blankets"
  | "oil-radiators"
  | "smart-thermostats"
  | "car-air-con"
  | "ac-accessories"
  | "smart-plugs"
  | "extension-leads"
  | "window-insulation"
  | "air-quality-monitors"
  | "cooling-gadgets"
  | "portable-power"
  | "misting-systems";

export interface Retailer {
  id: string; // e.g. "currys"
  name: string; // e.g. "Currys"
  awinMerchantId?: number; // set once joined in Awin; enables a tracked deeplink
  epnPartnerId?: string; // eBay EPN partner ID for deeplink tracking
}

export interface Offer {
  retailer: Retailer;
  price: number; // GBP
  url: string; // raw product URL at the retailer (wrapped at render time)
  status: StockStatus;
  stockQuantity?: number | null;
  clickAndCollect?: boolean;
  deliveryNote?: string; // "Delivered Sat 27 Jun"
  lastChecked: string; // ISO
}

export interface PricePoint {
  at: string; // ISO date
  price: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  btu?: number | null; // for AC / evaporative
  coverageM2?: number | null; // manufacturer-rated room size
  noise?: number | null; // dB
  image?: string | null;
  highlights: string[]; // 2–4 plain selling points
  offers: Offer[];
  priceHistory?: PricePoint[];
  season?: "summer" | "winter" | "all-year";
  popularity?: number; // GSC/Amazon click weight for sorting // for homepage seasonal pivot
  sample?: boolean; // true while showing seed data before live feeds connect
}

// Diff-engine events that drive emails, badges and content refresh.
export type StockEventType = "back_in_stock" | "went_out_of_stock" | "price_drop";

export interface StockEvent {
  type: StockEventType;
  productId: string;
  retailerId: string;
  at: string;
  from?: number; // prev price (for price_drop)
  to?: number; // new price
}

export interface AlertSubscription {
  email: string;
  productSlug: string;
  createdAt: string;
}
