import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { HeatStrip } from "@/components/HeatStrip";
import { Footer } from "@/components/Footer";
import { SiteSchema } from "@/components/SiteSchema";
import { CookieConsent } from "@/components/CookieConsent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://comparethecool.com"),
  title: {
    default: "Compare the Cool — Expert Cooling Reviews & Live Price Comparison",
    template: "%s · Compare the Cool",
  },
  description:
    "Independent expert reviews of portable air conditioners, dehumidifiers, fans, heaters and air purifiers. Compare live prices across retailers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteSchema />
        <HeatStrip />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
