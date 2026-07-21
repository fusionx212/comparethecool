import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { HeatStrip } from "@/components/HeatStrip";
import { Footer } from "@/components/Footer";
import { SiteSchema } from "@/components/SiteSchema";
import { CookieConsent } from "@/components/CookieConsent";
import { EbayEpnSmartTools } from "@/components/EbayEpnSmartTools";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://comparethecool.com"),
  title: {
    default: "Compare the Cool / Heat — Expert Reviews & Live Prices",
    template: "%s · Compare the Cool / Heat",
  },
  description:
    "Independent expert reviews of portable air conditioners, dehumidifiers, fans, heaters and air purifiers. Compare Amazon and eBay prices across the UK, EU, US and Australia.",
  alternates: {
    canonical: "https://comparethecool.com",
  },
};

const SITE_BOOT =
  `(function(){try{var h=location.hostname.toLowerCase();document.documentElement.dataset.site=h.indexOf("comparetheheat")>=0?"heat":"cool";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} data-site="cool">
      <head>
        <script dangerouslySetInnerHTML={{ __html: SITE_BOOT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteSchema />
        <HeatStrip />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <EbayEpnSmartTools />
      </body>
    </html>
  );
}
