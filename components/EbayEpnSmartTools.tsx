import Script from "next/script";
import { EBAY_EPN_CAMPID } from "@/lib/affiliate";

/**
 * eBay Partner Network Smart Links — rewrites on-page ebay.* links
 * to include campaign tracking on click. Campaign 5339164583.
 */
export function EbayEpnSmartTools() {
  return (
    <>
      <Script id="ebay-epn-config" strategy="afterInteractive">
        {`window._epn = {campaign: ${EBAY_EPN_CAMPID}};`}
      </Script>
      <Script
        id="ebay-epn-smart-tools"
        src="https://epnt.ebay.com/static/epn-smart-tools.js"
        strategy="afterInteractive"
      />
    </>
  );
}
