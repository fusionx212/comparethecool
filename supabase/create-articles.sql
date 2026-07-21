-- Compare the Cool — Blog Articles Table
-- Run this in Supabase Dashboard → SQL Editor: https://supabase.com/dashboard/project/kfhttxayccwsuecfmbbz/sql/new

CREATE TABLE IF NOT EXISTS public.ctc_articles (
    id TEXT PRIMARY KEY,
    country_code TEXT NOT NULL DEFAULT 'de',
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    category TEXT DEFAULT 'general',
    image TEXT,
    author TEXT DEFAULT 'Compare the Cool',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(country_code, slug)
);

CREATE INDEX IF NOT EXISTS idx_ctc_articles_country ON ctc_articles (country_code);
CREATE INDEX IF NOT EXISTS idx_ctc_articles_published ON ctc_articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ctc_articles_slug ON ctc_articles (country_code, slug);

-- RLS: public read, service role write
ALTER TABLE public.ctc_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read articles" ON public.ctc_articles FOR SELECT USING (true);
