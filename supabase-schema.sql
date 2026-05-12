-- ============================================================
-- OZY MARKETPLACE – FULL SUPABASE SCHEMA
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension (optional, we use text IDs)
-- create extension if not exists "uuid-ossp";

-- ── USERS ────────────────────────────────────────────────────
create table if not exists public.users (
  email text primary key,
  username text not null,
  discord_username text not null,
  joined_at timestamptz default now(),
  bio text,
  reputation integer default 0
);

alter table public.users enable row level security;
drop policy if exists "Anyone can read users" on public.users;
drop policy if exists "Anyone can insert users" on public.users;
drop policy if exists "Anyone can update users" on public.users;
create policy "Anyone can read users" on public.users for select using (true);
create policy "Anyone can insert users" on public.users for insert with check (true);
create policy "Anyone can update users" on public.users for update using (true);

-- ── LISTINGS ─────────────────────────────────────────────────
create table if not exists public.listings (
  id text primary key,
  title text not null,
  description text not null,
  price text not null,
  category text not null,
  condition text not null default 'Mint',
  game text not null default 'Roblox (General)',
  image_url text,
  seller_username text not null,
  seller_discord text not null,
  created_at timestamptz default now(),
  tags text[] default '{}',
  views integer default 0,
  bumps integer default 0,
  payment_methods text[] default '{}',
  trade_only boolean default false,
  negotiable boolean default false
);

alter table public.listings enable row level security;
drop policy if exists "Anyone can read listings" on public.listings;
drop policy if exists "Anyone can insert listings" on public.listings;
drop policy if exists "Anyone can update listings" on public.listings;
drop policy if exists "Anyone can delete listings" on public.listings;
create policy "Anyone can read listings" on public.listings for select using (true);
create policy "Anyone can insert listings" on public.listings for insert with check (true);
create policy "Anyone can update listings" on public.listings for update using (true);
create policy "Anyone can delete listings" on public.listings for delete using (true);

create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists listings_seller_idx on public.listings(seller_username);
create index if not exists listings_category_idx on public.listings(category);
create index if not exists listings_game_idx on public.listings(game);

-- ── SERVICES ─────────────────────────────────────────────────
create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null,
  price text not null,
  category text not null,
  delivery_time text not null default 'Negotiable',
  game text not null default 'Not Game-Specific',
  image_url text,
  seller_username text not null,
  seller_discord text not null,
  created_at timestamptz default now(),
  tags text[] default '{}',
  views integer default 0,
  bumps integer default 0,
  rating numeric(3,1) default 0,
  reviews integer default 0,
  payment_methods text[] default '{}',
  negotiable boolean default false
);

alter table public.services enable row level security;
drop policy if exists "Anyone can read services" on public.services;
drop policy if exists "Anyone can insert services" on public.services;
drop policy if exists "Anyone can update services" on public.services;
drop policy if exists "Anyone can delete services" on public.services;
create policy "Anyone can read services" on public.services for select using (true);
create policy "Anyone can insert services" on public.services for insert with check (true);
create policy "Anyone can update services" on public.services for update using (true);
create policy "Anyone can delete services" on public.services for delete using (true);

create index if not exists services_created_at_idx on public.services(created_at desc);
create index if not exists services_seller_idx on public.services(seller_username);
create index if not exists services_category_idx on public.services(category);
create index if not exists services_game_idx on public.services(game);

-- ── STORAGE BUCKET (run separately if needed) ─────────────────
-- This creates the listing-images bucket with 10-day auto-delete policy.
-- You can also do this in Supabase Dashboard → Storage → New Bucket

-- Insert bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,  -- 5MB max per file
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- Public read policy for storage
drop policy if exists "Public read listing images" on storage.objects;
create policy "Public read listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Anyone can upload listing images
drop policy if exists "Anyone can upload listing images" on storage.objects;
create policy "Anyone can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images');

-- Anyone can update listing images
drop policy if exists "Anyone can update listing images" on storage.objects;
create policy "Anyone can update listing images"
  on storage.objects for update
  using (bucket_id = 'listing-images');

-- Anyone can delete listing images
drop policy if exists "Anyone can delete listing images" on storage.objects;
create policy "Anyone can delete listing images"
  on storage.objects for delete
  using (bucket_id = 'listing-images');

-- ── AUTO-DELETE IMAGES AFTER 10 DAYS ─────────────────────────
-- This Supabase Edge Function or pg_cron job deletes old images.
-- Schedule this as a cron job in Supabase Dashboard → Database → pg_cron
-- (Enable pg_cron extension first under Database → Extensions)

-- Enable pg_cron (run once):
-- create extension if not exists pg_cron;

-- Schedule daily cleanup of images older than 10 days:
-- select cron.schedule(
--   'delete-old-listing-images',
--   '0 3 * * *',   -- runs at 3am UTC every day
--   $$
--     delete from storage.objects
--     where bucket_id = 'listing-images'
--     and created_at < now() - interval '10 days';
--   $$
-- );

-- Also delete old listing records (optional, keep this disabled unless you want auto-expiry):
-- select cron.schedule(
--   'delete-old-listings',
--   '0 4 * * *',
--   $$
--     delete from public.listings where created_at < now() - interval '30 days';
--   $$
-- );

-- ── VERIFY EVERYTHING ────────────────────────────────────────
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
