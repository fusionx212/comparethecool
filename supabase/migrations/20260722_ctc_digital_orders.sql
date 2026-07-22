-- Digital product orders (Stripe Checkout companions)
create table if not exists public.ctc_digital_orders (
  session_id text primary key,
  sku text not null,
  email text,
  country_code text,
  product_slug text,
  category text,
  status text not null default 'pending',
  livemode boolean,
  amount_pence integer,
  currency text default 'gbp',
  capability_token text,
  capability_token_hash text,
  event_ids text[] not null default '{}',
  download_url text,
  last_error text,
  fulfilled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ctc_digital_orders_status_idx on public.ctc_digital_orders (status);
create index if not exists ctc_digital_orders_email_idx on public.ctc_digital_orders (email);

alter table public.ctc_digital_orders enable row level security;

-- No public policies: service role only (webhooks / download API).
