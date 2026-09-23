create table if not exists public.cumilla_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_type text not null check (profile_type in ('candidate','responsible')),
  name text not null check (char_length(name) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  designation text not null default '',
  area_name text not null default '',
  upazila text check (upazila is null or upazila in ('daudkandi','meghna')),
  union_name text not null default '',
  bio text not null default '',
  education text not null default '',
  profession text not null default '',
  phone text not null default '',
  email text not null default '',
  facebook_url text,
  website_url text,
  photo_path text,
  photo_url text,
  source_url text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default true,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cumilla_profiles_public on public.cumilla_profiles(profile_type,status,featured,sort_order,updated_at desc);
create index if not exists cumilla_profiles_created_by on public.cumilla_profiles(created_by);

alter table public.cumilla_profiles enable row level security;
grant select on public.cumilla_profiles to anon, authenticated;
grant insert, update, delete on public.cumilla_profiles to authenticated;

create policy profiles_read on public.cumilla_profiles for select using (
  status='published' or exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
);
create policy profiles_create on public.cumilla_profiles for insert to authenticated with check (
  created_by=(select auth.uid()) and exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role in ('admin','publisher','editor'))
);
create policy profiles_update on public.cumilla_profiles for update to authenticated using (
  exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role in ('admin','publisher','editor'))
) with check (
  exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role in ('admin','publisher','editor'))
);
create policy profiles_delete on public.cumilla_profiles for delete to authenticated using (
  exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role='admin')
);
