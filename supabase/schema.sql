-- Compare the Cool — Supabase schema
-- Shares the estate Supabase project with ukaircontracker
-- Table prefix: ctc_ (Compare the Cool)

-- Products per country
CREATE TABLE IF NOT EXISTS ctc_products (
  id TEXT PRIMARY KEY,
  country_code TEXT NOT NULL DEFAULT 'uk',  -- uk, de, fr, it, es, nl
  data JSONB NOT NULL DEFAULT '{}',
  stock_status TEXT DEFAULT 'in_stock',
  price NUMERIC,
  image TEXT,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ctc_products_country ON ctc_products (country_code);
CREATE INDEX IF NOT EXISTS idx_ctc_products_stock ON ctc_products (stock_status);

-- Click tracking per country
CREATE TABLE IF NOT EXISTS ctc_clicks (
  id BIGSERIAL PRIMARY KEY,
  country_code TEXT NOT NULL DEFAULT 'uk',
  product_slug TEXT NOT NULL,
  retailer_id TEXT NOT NULL,
  referrer TEXT,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ctc_clicks_country ON ctc_clicks (country_code);
CREATE INDEX IF NOT EXISTS idx_ctc_clicks_at ON ctc_clicks (at DESC);

-- Alert subscriptions (shared across countries)
CREATE TABLE IF NOT EXISTS ctc_alert_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'uk',
  confirmed BOOLEAN NOT NULL DEFAULT false,
  token TEXT NOT NULL,
  sent_alert_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (email, product_slug, country_code)
);
CREATE INDEX IF NOT EXISTS idx_ctc_alerts_unsent ON ctc_alert_subscriptions (country_code)
  WHERE sent_alert_at IS NULL AND unsubscribed_at IS NULL;

-- Price history for diff detection
CREATE TABLE IF NOT EXISTS ctc_price_snapshots (
  product_id TEXT NOT NULL,
  retailer_id TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'uk',
  price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,
  at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, retailer_id, country_code)
);

-- RLS: public read for products, service-role for writes
ALTER TABLE ctc_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctc_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctc_alert_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctc_price_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read products" ON ctc_products FOR SELECT USING (true);
CREATE POLICY "public read clicks" ON ctc_clicks FOR SELECT USING (true);
CREATE POLICY "public insert clicks" ON ctc_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "public read price_snapshots" ON ctc_price_snapshots FOR SELECT USING (true);
