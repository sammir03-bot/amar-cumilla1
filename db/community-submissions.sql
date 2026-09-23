create table if not exists public.cumilla_submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('join','problem','feedback')),
  full_name text not null check (char_length(full_name) between 2 and 120),
  phone text not null default '' check (char_length(phone) <= 40),
  email text not null default '' check (char_length(email) <= 180),
  upazila text not null check (upazila in ('daudkandi','meghna')),
  union_name text not null default '' check (char_length(union_name) <= 160),
  subject text not null default '' check (char_length(subject) <= 220),
  message text not null check (char_length(message) between 3 and 6000),
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','reviewing','resolved','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (type <> 'join' or char_length(phone) >= 6),
  check (consent = true)
);

create index if not exists cumilla_submissions_type_created on public.cumilla_submissions(type, created_at desc);
create index if not exists cumilla_submissions_status_created on public.cumilla_submissions(status, created_at desc);

alter table public.cumilla_submissions enable row level security;
grant insert on public.cumilla_submissions to anon, authenticated;
grant select, update on public.cumilla_submissions to authenticated;

create policy submissions_public_insert on public.cumilla_submissions
for insert to anon, authenticated
with check (status='new' and consent=true and type in ('join','problem','feedback'));

create policy submissions_staff_read on public.cumilla_submissions
for select to authenticated
using (exists(select 1 from public.cumilla_staff where user_id=(select auth.uid())));

create policy submissions_staff_update on public.cumilla_submissions
for update to authenticated
using (exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role in ('admin','publisher')))
with check (exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role in ('admin','publisher')));
