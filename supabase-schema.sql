-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → New query → paste → Run

-- Users table
create table if not exists public.users (
  email text primary key,
  username text not null,
  discord_username text not null,
  joined_at timestamptz default now()
);

-- Listings table
create table if not exists public.listings (
  id text primary key,
  title text not null,
  description text not null,
  price text not null,
  category text not null,
  condition text not null,
  image_url text,
  seller_username text not null,
  seller_discord text not null,
  created_at timestamptz default now(),
  tags text[] default '{}',
  views integer default 0,
  bumps integer default 0
);

-- Allow public read on listings (anyone can browse)
alter table public.listings enable row level security;
create policy "Anyone can read listings" on public.listings for select using (true);
create policy "Anyone can insert listings" on public.listings for insert with check (true);
create policy "Anyone can update listings" on public.listings for update using (true);
create policy "Anyone can delete listings" on public.listings for delete using (true);

-- Allow public read/write on users
alter table public.users enable row level security;
create policy "Anyone can read users" on public.users for select using (true);
create policy "Anyone can insert users" on public.users for insert with check (true);
create policy "Anyone can update users" on public.users for update using (true);

-- Index for fast lookups
create index if not exists listings_created_at_idx on public.listings(created_at desc);
create index if not exists listings_seller_idx on public.listings(seller_username);

-- Services table
create table if not exists public.services (
  id text primary key,
  title text not null,
  description text not null,
  price text not null,
  category text not null,
  delivery_time text not null default 'Negotiable',
  image_url text,
  seller_username text not null,
  seller_discord text not null,
  created_at timestamptz default now(),
  tags text[] default '{}',
  views integer default 0,
  bumps integer default 0,
  rating numeric(3,1) default 0,
  reviews integer default 0
);

alter table public.services enable row level security;
create policy "Anyone can read services" on public.services for select using (true);
create policy "Anyone can insert services" on public.services for insert with check (true);
create policy "Anyone can update services" on public.services for update using (true);
create policy "Anyone can delete services" on public.services for delete using (true);

create index if not exists services_created_at_idx on public.services(created_at desc);
create index if not exists services_seller_idx on public.services(seller_username);
