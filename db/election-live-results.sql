-- Union election live-results module for Amar Cumilla-1.
-- Applied to production on 2026-09-23. Keep this file for new environments.

create table if not exists public.cumilla_election_settings (
  id smallint primary key default 1 check (id = 1),
  live_mode boolean not null default false,
  public_enabled boolean not null default true,
  election_day date,
  headline text not null default 'লাইভ ইউনিয়ন নির্বাচন ফলাফল',
  note text not null default 'সংগৃহীত লাইভ ফলাফল; সংশ্লিষ্ট রিটার্নিং অফিসার বা নির্বাচন কমিশনের আনুষ্ঠানিক ঘোষণাই চূড়ান্ত।',
  updated_at timestamptz not null default now()
);
insert into public.cumilla_election_settings(id) values (1) on conflict (id) do nothing;

create table if not exists public.cumilla_elections (
  id uuid primary key default gen_random_uuid(),
  upazila text not null check (upazila in ('daudkandi','meghna')),
  union_slug text not null,
  union_name text not null,
  title text not null default 'ইউনিয়ন পরিষদ নির্বাচন',
  status text not null default 'setup' check (status in ('setup','live','completed','official')),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(upazila, union_slug)
);

create table if not exists public.cumilla_election_candidates (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.cumilla_elections(id) on delete cascade,
  name text not null,
  symbol text not null default '',
  photo_url text,
  description text not null default '',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cumilla_election_centres (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.cumilla_elections(id) on delete cascade,
  centre_code text not null,
  name text not null,
  total_voters integer not null default 0 check (total_voters >= 0),
  invalid_votes integer not null default 0 check (invalid_votes >= 0),
  status text not null default 'pending' check (status in ('pending','reported','verified','official')),
  reported_at timestamptz,
  verified_at timestamptz,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(election_id, centre_code)
);

create table if not exists public.cumilla_election_results (
  id uuid primary key default gen_random_uuid(),
  centre_id uuid not null references public.cumilla_election_centres(id) on delete cascade,
  candidate_id uuid not null references public.cumilla_election_candidates(id) on delete cascade,
  votes integer not null default 0 check (votes >= 0),
  updated_at timestamptz not null default now(),
  unique(centre_id, candidate_id)
);
