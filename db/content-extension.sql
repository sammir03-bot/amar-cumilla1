alter table public.cumilla_posts
 add column kind text not null default 'news' check (kind in ('news','event','leader','gallery','document','page','archive')),
 add column area_keys text[] not null default '{}',
 add column media_paths text[] not null default '{}',
 add column event_at timestamptz,
 add column venue text not null default '',
 add column updated_at timestamptz not null default now();
create index cumilla_posts_kind on public.cumilla_posts(kind,status,published_at desc);
create index cumilla_posts_areas on public.cumilla_posts using gin(area_keys);
alter table public.cumilla_areas
 add column villages text not null default '',
 add column institutions text not null default '',
 add column services text not null default '',
 add column updated_at timestamptz not null default now();
create table public.cumilla_audit (
 id bigint generated always as identity primary key,
 actor_id uuid,
 entity text not null,
 record_id uuid not null,
 action text not null,
 happened_at timestamptz not null default now()
);
alter table public.cumilla_audit enable row level security;
grant select on public.cumilla_audit to authenticated;
create policy audit_admin on public.cumilla_audit for select to authenticated using (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()) and role='admin')
);
create schema if not exists cumilla_internal;
revoke all on schema cumilla_internal from public,anon,authenticated;
create function cumilla_internal.audit_change() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then return new; end if;
 insert into public.cumilla_audit(actor_id,entity,record_id,action) values(auth.uid(),TG_TABLE_NAME,new.id,TG_OP);
 new.updated_at=now();
 return new;
end $$;
revoke all on function cumilla_internal.audit_change() from public,anon,authenticated;
create trigger cumilla_post_audit before insert or update on public.cumilla_posts for each row execute function cumilla_internal.audit_change();
create trigger cumilla_area_audit before insert or update on public.cumilla_areas for each row execute function cumilla_internal.audit_change();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values(
 'cumilla-media','cumilla-media',false,2097152,array['image/jpeg','image/png','image/webp','application/pdf']
);
create policy cumilla_media_read on storage.objects for select to anon,authenticated using (
 bucket_id='cumilla-media' and (
 exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
 or exists(select 1 from public.cumilla_posts where status='published' and published_at<=now() and name=any(media_paths))
 ));
create policy cumilla_media_upload on storage.objects for insert to authenticated with check(
 bucket_id='cumilla-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
);

