/**
 * Static article seeds (mirrors ctc_articles). No LLM at serve time.
 */

export interface CatalogArticle {
  slug: string;
  country_code: string;
  title: string;
  excerpt: string;
  body: string[];
  category?: string;
  published_at: string;
}

export const SEED_ARTICLES: CatalogArticle[] = [
  {
    slug: "portable-ac-btu-guide",
    country_code: "uk",
    title: "How many BTU do you need? Portable AC room-size guide",
    excerpt: "Match BTU to room size so you do not overspend on cooling you cannot use.",
    body: [
      "As a rule of thumb, aim for roughly 60–80 BTU per square metre for a typical UK room with average insulation.",
      "A 20 m² bedroom usually needs around 7,000–9,000 BTU. Open-plan spaces and sunny rooms need more.",
      "Use our BTU calculator, then compare live Amazon and eBay prices on our best portable AC page.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-01",
  },
  {
    slug: "dehumidifier-vs-mould",
    country_code: "uk",
    title: "Dehumidifier vs mould: what actually works year-round",
    excerpt: "Damp and mould are not a summer-only problem — extraction capacity and RH targets matter.",
    body: [
      "Keep indoor relative humidity around 40–60%. Below that, air feels dry; above, mould thrives.",
      "For a typical flat, a 10–12L dehumidifier is often enough. Larger basements need 20L+.",
      "All-year dehumidifier reviews with live prices are on our UK dehumidifiers guide.",
    ],
    category: "dehumidifiers",
    published_at: "2026-05-12",
  },
  {
    slug: "oil-radiator-running-cost",
    country_code: "uk",
    title: "Oil radiator running costs vs turning the boiler up",
    excerpt: "Spot-heating one room can cost less than heating the whole house — if you size the wattage right.",
    body: [
      "A 2000W oil radiator costs roughly the unit rate × 2 per hour at full tilt. Thermostats cut that sharply.",
      "Use our running-cost calculator with your local unit rate, then compare oil radiators.",
    ],
    category: "oil-radiators",
    published_at: "2026-01-08",
  },
  {
    slug: "beste-mobile-klimaanlage-kaufberatung",
    country_code: "de",
    title: "Mobile Klimaanlage kaufen: BTU, Energieklasse und Abluft",
    excerpt: "Worauf Sie bei Monoblock-Geräten in Deutschland achten sollten — ohne Marketingversprechen.",
    body: [
      "Pro Quadratmeter rechnen Sie mit etwa 60–80 BTU. Ein 25 m² Raum braucht oft mindestens 7.000 BTU.",
      "Ohne korrekt verlegten Abluftschlauch kühlt kein Monoblock zuverlässig.",
      "Aktuelle Preise finden Sie in unserem Test der besten mobilen Klimaanlagen.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-15",
  },
  {
    slug: "luftentfeuchter-schimmel",
    country_code: "de",
    title: "Luftentfeuchter gegen Schimmel: ganzjährig sinnvoll",
    excerpt: "Warum Entfeuchten auch außerhalb der Hitzewelle Geld und Bausubstanz spart.",
    body: [
      "Relative Luftfeuchte idealerweise 40–60 %. Keller und Altbauwohnungen profitieren ganzjährig.",
      "Vergleichen Sie Meaco- und Pro-Breeze-Modelle mit Live-Preisen auf Amazon.de und eBay.",
    ],
    category: "dehumidifiers",
    published_at: "2026-04-20",
  },
  {
    slug: "best-portable-ac-under-400",
    country_code: "us",
    title: "Best portable air conditioners under $400",
    excerpt: "Value picks that still move enough BTU for apartments and home offices.",
    body: [
      "Under $400 you usually trade brand polish for raw BTU. Check noise ratings carefully for bedrooms.",
      "Compare live Amazon.com and eBay prices on our US portable AC guide.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-05-01",
  },
  {
    slug: "meilleur-climatiseur-mobile",
    country_code: "fr",
    title: "Meilleur climatiseur mobile 2026 : BTU et prix",
    excerpt: "Comment dimensionner un monobloc et comparer Amazon.fr / eBay.",
    body: [
      "Comptez environ 60–80 BTU par m². Un salon de 25 m² demande souvent 7 000 BTU ou plus.",
      "Sans kit fenêtre et gaine d'évacuation, le monobloc ne refroidit pas efficacement.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-10",
  },
  {
    slug: "miglior-condizionatore-portatile",
    country_code: "it",
    title: "Miglior condizionatore portatile 2026",
    excerpt: "Guida BTU, rumore e confronto prezzi Amazon.it / eBay.",
    body: [
      "Per una stanza media servono spesso 7.000–9.000 BTU. Verificate i dB per la camera da letto.",
      "Confrontate i prezzi aggiornati nella nostra pagina best-of Italia.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-12",
  },
  {
    slug: "mejor-aire-portatil",
    country_code: "es",
    title: "Mejor aire acondicionado portátil 2026",
    excerpt: "BTU, consumo y precios en Amazon.es y eBay.",
    body: [
      "Calcule ~60–80 BTU por m². Las habitaciones soleadas necesitan margen extra.",
      "Use nuestra calculadora BTU y luego compare precios en vivo.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-14",
  },
  {
    slug: "beste-mobiele-airco",
    country_code: "nl",
    title: "Beste mobiele airco 2026",
    excerpt: "BTU-gids en prijsvergelijking voor Nederland.",
    body: [
      "Reken op 60–80 BTU per m². Let op geluidsniveau voor slaapkamers.",
      "Vergelijk actuele prijzen op onze Nederlandse best-of pagina.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-06-16",
  },
  {
    slug: "portable-ac-australia-summer",
    country_code: "au",
    title: "Best portable air conditioners for Australian summers",
    excerpt: "Southern-hemisphere season tips and Amazon.com.au / eBay AU prices.",
    body: [
      "AU summer peaks when the northern sites push heaters — our catalog flips with the hemisphere.",
      "Check BTU against open-plan living; evaporative coolers suit dry climates better than humid coasts.",
    ],
    category: "portable-air-conditioners",
    published_at: "2026-01-20",
  },
];

export function articlesForCountry(country: string): CatalogArticle[] {
  const exact = SEED_ARTICLES.filter((a) => a.country_code === country);
  if (exact.length) return exact;
  // Fallback: English UK articles for other EN markets
  if (["au", "us", "eu"].includes(country)) {
    return SEED_ARTICLES.filter((a) => a.country_code === "uk");
  }
  return SEED_ARTICLES.filter((a) => a.country_code === "uk");
}

export function articleBySlug(country: string, slug: string): CatalogArticle | null {
  return (
    SEED_ARTICLES.find((a) => a.slug === slug && a.country_code === country) ||
    SEED_ARTICLES.find((a) => a.slug === slug) ||
    null
  );
}
