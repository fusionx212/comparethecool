# Compare the Cool / Compare the Heat — Architecture & Build Plan

## Growth Strategy: Citation-First, Zero Ad Budget

### How ukaircontracker grew (8,800 clicks/month, £0 ad spend)
1. Found an underserved search intent: "air con stock checker UK" — nobody had live data
2. Built the ONLY site with real-time stock across Amazon + eBay
3. Got cited by journalists during heatwaves ("check stock at ukaircontracker.co.uk")
4. Ranked #1 for branded queries, #3-14 for stock-checker queries
5. No backlink building, no ads — pure organic via being the only source

### Same playbook, global scale
| Market | Keyword | Volume/mo | Competition | Our play |
|--------|---------|-----------|-------------|----------|
| Germany | "beste mobile klimaanlage" | 33,100 | Chip.de, heise.de | Live stock + prices they don't have |
| France | "meilleur climatiseur mobile" | 40,500 | Capital.fr, Frandroid | Multi-retailer comparison |
| Spain | "mejor aire acondicionado portátil" | 60,500 | El Corte Inglés | Amazon + eBay side-by-side |
| Italy | "miglior condizionatore portatile" | 40,500 | Altroconsumo | Live pricing freshness |
| US | "best portable air conditioner" | 90,500 | Wirecutter, Tom's Guide | Price comparison they don't offer |
| Australia | "best portable air conditioner" | 14,800 | Choice, Appliances Online | eBay AU + Amazon AU |
| Netherlands | "beste mobiele airco" | 22,200 | Coolblue, Bol.com | Cross-retailer stock checker |

## Architecture

```
comparethecool.com ─────────────────────────────────────────────┐
comparetheheat.com ── (same site, seasonal branding) ──────────┤
                                                                 │
┌────────────────────────────────────────────────────────────────┤
│  Next.js static export on Netlify                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ /uk/     │  │ /de/     │  │ /fr/     │  │ /us/     │     │
│  │ reviews  │  │ bewertung│  │ avis     │  │ reviews  │     │
│  │ /best/   │  │ /beste/  │  │ /meilleur│  │ /best/   │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │              │              │              │           │
│       └──────────────┴──────────────┴──────────────┘           │
│                         │                                      │
│                   Supabase (kfhttxayccwsuecfmbbz)              │
│                   ┌─────────────────────────┐                  │
│                   │ ctc_products (per country)│                 │
│                   │ ctc_articles (blog)      │                 │
│                   │ ctc_clicks (tracking)    │                 │
│                   │ ctc_alerts (email subs)  │                 │
│                   └─────────────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
```

## Content Plan: Citation-First Pages

### Tier 1: Best-of review pages (primary traffic drivers)
Each targets one high-volume commercial keyword, contains:
- At-a-glance top 3 picks
- Full comparison table (Amazon + eBay prices, live)
- Individual reviews with pros/cons/verdict
- Buying guide with honest advice
- FAQ schema for AI citation
- Methodology section ("How we test")

### Tier 2: Long-tail review articles (blog)
Supabase-served articles targeting specific queries:
- "[Brand] vs [Brand]: honest comparison 2026"
- "Best [category] under [price] 2026"
- "Is the [product] worth it? Our review"
- "[Problem]? Here's the solution"

### Tier 3: Free tools (link magnets)
- BTU calculator (per country, metric/imperial)
- Running cost calculator (per-country energy rates)
- Room size calculator
- "Which AC is right for me?" quiz

## Compliance Checklist

### GDPR / Privacy
- Cookie consent banner (CookieConsent component — already built)
- Privacy policy page (per-country, localized)
- Right to be forgotten (alert unsubscribe already built)
- Data processing: only email for alerts, no tracking cookies beyond essential

### eBay Affiliate Compliance
- Every eBay link must include: "Purchases made through eBay" disclosure
- eBay Partner Network requires: "We earn from qualifying purchases"
- Per eBay ToS §4.2: must not misrepresent stock levels
- All prices clearly marked as "at time of check" with timestamp

### Affiliate Disclosure (FTC / EU Omnibus)
- Clear disclosure on every page with affiliate links
- "As an Amazon Associate, we earn from qualifying purchases"
- "eBay purchases through our links may earn us commission"
- Per-country language (EN, DE, FR, IT, ES, NL)

## Build Phases

### Phase 1 — Core site + DE (today)
- [ ] Clean build with all pages compiling
- [ ] Germany best-of page with real Amazon.de + eBay.de products
- [ ] Cloudflare DNS, email routing, compliance pages
- [ ] 5 blog articles seeded to Supabase

### Phase 2 — FR, IT, ES (next 48h)
- [ ] France, Italy, Spain best-of pages
- [ ] 5 articles per country

### Phase 3 — US, AU, NL
- [ ] US best-of page
- [ ] Australia, Netherlands pages
- [ ] Tools (BTU calculator, running cost)

### Phase 4 — Email + alerts
- [ ] Price drop alerts per country
- [ ] Weekly newsletter seeding
