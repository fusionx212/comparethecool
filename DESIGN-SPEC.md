# DESIGN-SPEC — Compare the Cool / Compare the Heat

## Brand system
Two seasonal skins, one static Next.js app.

| Token | Cool | Heat |
|-------|------|------|
| Background | `#eef5f8` frost | `#f7f0ea` ember wash |
| Brand | `#0792b4` cyan | `#c2410c` ember |
| Ink | `#08171f` | `#1c1008` |
| Surface tint | `#e2eef3` | `#f3e6dc` |

## Laws
- Square corners only (no radius)
- No emoji chrome in UI chrome
- Tabular nums for every price / BTU / watt / £
- Status = square LED (in stock / low / sold)
- First viewport: brand, one H1, one line, one CTA group — no card clutter

## Money modules (every best-of)
1. Top 3 picks
2. Amazon vs eBay compare table
3. Per-product verdict + sticky buy CTAs
4. FAQ + ItemList JSON-LD

## Serving
Static / ISR bake from Supabase (+ offline seed fallback). Hostname sets `data-site` via inline script — no `headers()` (keeps Netlify function burn at zero per view).
