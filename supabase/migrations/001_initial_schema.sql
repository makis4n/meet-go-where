-- ============================================================
-- Migration 001: Initial schema
-- Singapore food & events aggregator
-- ============================================================

-- ------------------------------------------------------------
-- Listings: unified table for food venues + events
-- ------------------------------------------------------------
create table if not exists listings (
  id           uuid primary key default gen_random_uuid(),

  -- Source tracking
  source       text not null check (source in ('sgculturepass', 'honeycombers')),
  source_id    text not null,           -- original ID / URL slug from the source
  source_url   text,                    -- canonical URL on the source site

  -- Classification
  type         text not null check (type in ('food', 'event', 'activity')),
  tags         text[] not null default '{}',  -- e.g. ['chinese', 'hawker', 'family-friendly']

  -- Core content
  name         text not null,
  description  text,
  image_url    text,

  -- Location
  address      text,
  postal_code  text,
  lat          float8,
  lng          float8,

  -- Pricing (SGD cents — integers avoid float rounding; null = unknown)
  price_min    int,
  price_max    int,

  -- Event timing (null for permanent food venues)
  starts_at    timestamptz,
  ends_at      timestamptz,

  -- Raw payload — never discard; lets you re-derive fields without re-scraping
  raw_data     jsonb not null default '{}',

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  unique (source, source_id)
);

-- ------------------------------------------------------------
-- Scrape runs: audit log of every scrape job
-- ------------------------------------------------------------
create table if not exists scrape_runs (
  id           uuid primary key default gen_random_uuid(),
  source       text not null,
  status       text not null check (status in ('running', 'success', 'failed')),
  rows_upserted int,
  error        text,                    -- populated on failure
  started_at   timestamptz not null default now(),
  finished_at  timestamptz
);

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------

-- Filter queries
create index if not exists listings_source  on listings (source);
create index if not exists listings_type    on listings (type);
create index if not exists listings_tags    on listings using gin (tags);

-- Date range queries for events
create index if not exists listings_dates   on listings (starts_at, ends_at)
  where starts_at is not null;

-- Geo queries: find listings near a point
-- Uses a functional index on (lng, lat) as a point — works without PostGIS
-- For radius queries use: (lat - $lat)^2 + (lng - $lng)^2 < ($radius_deg)^2
create index if not exists listings_geo on listings (lat, lng)
  where lat is not null and lng is not null;

-- Budget filter
create index if not exists listings_price on listings (price_min, price_max);

-- ------------------------------------------------------------
-- Auto-update updated_at on row change
-- ------------------------------------------------------------
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_updated_at
  before update on listings
  for each row execute function update_updated_at();

-- ------------------------------------------------------------
-- Row-level security (public read, no anonymous writes)
-- ------------------------------------------------------------
alter table listings enable row level security;
alter table scrape_runs enable row level security;

-- Anyone can read listings (the frontend uses the anon key)
create policy "Public read listings"
  on listings for select
  using (true);

-- Only the service role (backend) can write
create policy "Service role write listings"
  on listings for all
  using (auth.role() = 'service_role');

create policy "Service role write scrape_runs"
  on scrape_runs for all
  using (auth.role() = 'service_role');
