import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { HeatStrip } from "@/components/HeatStrip";
import { Footer } from "@/components/Footer";
import { SiteSchema } from "@/components/SiteSchema";
import { CookieConsent } from "@/components/CookieConsent";
import { getAllProducts, getFreshestCheckedAt, isAnyInStock } from "@/lib/data";
import { timeAgo } from "@/lib/format";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://comparethecool.com"),
  title: {
    default: "Compare the Cool — Expert Cooling Reviews & Live Price Comparison",
    template: "%s · Compare the Cool",
  },
  description:
    "Independent expert reviews of portable air conditioners, dehumidifiers, fans, heaters and air purifiers. We test, rate, and compare live prices across retailers so you buy the right one at the best price.",
  keywords: [
    "best portable air conditioner reviews",
    "portable AC buying guide",
    "dehumidifier reviews",
    "tower fan comparison",
    "air purifier reviews",
    "oil radiator best buy",
    "cooling product reviews",
    "heating product comparison",
    "home climate reviews",
  ],
  openGraph: {
    type: "website",
    siteName: "UK Air Con Tracker",
    title: "UK Air Con Tracker — live fan & air conditioning stock",
    description:
      "What's actually in stock right now across UK retailers — with restock alerts when sold-out units come back.",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Real freshness, not request time — was previously new Date(), so the
  // header always claimed "just now" even when the underlying stock data was
  // days stale. Same timeAgo() clock the per-offer "checked" labels use, so
  // the header and the product tables can never disagree.
  const freshestCheckedAt = await getFreshestCheckedAt();
  const updated = freshestCheckedAt ? timeAgo(freshestCheckedAt, new Date()) : "unavailable";
  // Cheap: getFreshestCheckedAt() above already populated the 2-minute
  // in-process product cache (lib/data.ts), so this hits that cache rather
  // than issuing a second Supabase query.
  const allProducts = await getAllProducts();
  const inStockCount = allProducts.filter(isAnyInStock).length;

  return (
    <html lang="en-GB" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteSchema inStock={inStockCount} total={allProducts.length} />
        <HeatStrip updated={updated} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
