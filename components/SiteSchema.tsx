// Site-wide Organization + WebSite schema — entity clarity for AI search,
// classic rich results, and citation engine optimization.
// Reviews site positioning: expert testing, rating, and comparison.
const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://comparethecool.com";

export function SiteSchema({ inStock, total }: { inStock?: number; total?: number } = {}) {
  const liveFact =
    inStock !== undefined && total !== undefined
      ? ` We currently track ${total} products with live prices — ${inStock} available right now.`
      : "";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE}/#org`,
        name: "Compare the Cool",
        url: BASE,
        description:
          `Independent expert reviews and price comparison for cooling, heating, and air quality products. We test, rate, and compare portable air conditioners, dehumidifiers, fans, heaters and air purifiers across major retailers.${liveFact}`,
        knowsAbout: [
          "Portable air conditioners",
          "Dehumidifiers",
          "Air purifiers",
          "Tower fans",
          "Pedestal fans",
          "Oil radiators",
          "Electric blankets",
          "Heated airers",
          "Ice makers",
          "Home climate products",
          "Product reviews",
          "Price comparison",
        ],
        areaServed: [
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "Germany" },
          { "@type": "Country", name: "France" },
          { "@type": "Country", name: "Italy" },
          { "@type": "Country", name: "Spain" },
          { "@type": "Country", name: "Netherlands" },
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Australia" },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: "Compare the Cool",
        publisher: { "@id": `${BASE}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
