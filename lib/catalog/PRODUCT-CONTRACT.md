# ctc_products contract

## Root columns
| Column | Type | Notes |
|--------|------|-------|
| id | text PK | `{country}-{slug}` |
| country_code | text | uk, de, fr, it, es, nl, us, au, eu |
| data | jsonb | see below |
| stock_status | text | in_stock \| low_stock \| out_of_stock \| preorder |
| price | numeric | lowest offer |
| image | text | optional CDN URL |
| last_checked | timestamptz | |

## data JSONB
```
slug, name, brand, category, season,
highlights[], specs{}, offers[], editorial{},
amazon_asin, ebay_item_id, rating, review_count, popularity
```

## Serving
Build/ISR reads Supabase; if empty → `lib/catalog/seed-data.ts`.
Never call an LLM to populate products at request time.
