create table public.cumilla_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('admin','editor','publisher'))
);
alter table public.cumilla_staff enable row level security;
grant select on public.cumilla_staff to anon, authenticated;
create policy staff_self on public.cumilla_staff for select to authenticated using (user_id = (select auth.uid()));

create table public.cumilla_areas (
 id uuid primary key default gen_random_uuid(),
 upazila text not null check (upazila in ('daudkandi','meghna')),
 slug text not null,
 name text not null,
 kind text not null check (kind in ('union','municipality')),
 description text not null default '',
 source_url text,
 verified_at timestamptz,
 published boolean not null default false,
 unique(upazila,slug)
);
alter table public.cumilla_areas enable row level security;
grant select on public.cumilla_areas to anon,authenticated;
grant insert,update on public.cumilla_areas to authenticated;
create policy areas_read on public.cumilla_areas for select using (
 (published and verified_at is not null) or exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
);
create policy areas_write on public.cumilla_areas for insert to authenticated with check (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role='admin')
);
create policy areas_update on public.cumilla_areas for update to authenticated using (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role='admin')
) with check (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role='admin')
);

create table public.cumilla_posts (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(title) between 1 and 180),
 slug text not null unique,
 body text not null default '',
 status text not null default 'draft' check(status in ('draft','review','published','archived')),
 author_id uuid not null references auth.users(id),
 published_at timestamptz,
 created_at timestamptz not null default now(),
 check(status <> 'published' or published_at is not null)
);
create index cumilla_posts_publication on public.cumilla_posts(status,published_at desc);
create index cumilla_posts_author on public.cumilla_posts(author_id);
alter table public.cumilla_posts enable row level security;
grant select on public.cumilla_posts to anon,authenticated;
grant insert,update on public.cumilla_posts to authenticated;
create policy posts_read on public.cumilla_posts for select using (
 (status='published' and published_at<=now()) or exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
);
create policy posts_create on public.cumilla_posts for insert to authenticated with check (
 author_id=(select auth.uid()) and exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and (role in ('admin','publisher') or (role='editor' and status in ('draft','review'))))
);
create policy posts_update on public.cumilla_posts for update to authenticated using (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and (role in ('admin','publisher') or (role='editor' and author_id=(select auth.uid()) and status in ('draft','review'))))
) with check (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and (role in ('admin','publisher') or (role='editor' and author_id=(select auth.uid()) and status in ('draft','review'))))
);
