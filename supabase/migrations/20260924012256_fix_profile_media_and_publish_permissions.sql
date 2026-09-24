-- Published profiles use the same private media bucket as published articles.
alter policy cumilla_media_read on storage.objects using (
 bucket_id='cumilla-media' and (
  exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
  or exists(select 1 from public.cumilla_posts p where p.status='published' and p.published_at<=now() and objects.name=any(p.media_paths))
  or exists(select 1 from public.cumilla_profiles p where p.status='published' and p.photo_path=objects.name)
 )
);
alter policy cumilla_media_cleanup_own_unused on storage.objects using (
 bucket_id='cumilla-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
 and not exists(select 1 from public.cumilla_posts p where objects.name=any(p.media_paths))
 and not exists(select 1 from public.cumilla_profiles p where p.photo_path=objects.name)
);
-- Enforce publishing permissions even for direct API requests.
alter policy profiles_create on public.cumilla_profiles with check (
 created_by=(select auth.uid()) and exists(select 1 from public.cumilla_staff s where s.user_id=(select auth.uid()) and (s.role in ('admin','publisher') or (s.role='editor' and status<>'published')))
);
alter policy profiles_update on public.cumilla_profiles using (
 exists(select 1 from public.cumilla_staff s where s.user_id=(select auth.uid()) and (s.role in ('admin','publisher') or (s.role='editor' and status<>'published')))
) with check (
 exists(select 1 from public.cumilla_staff s where s.user_id=(select auth.uid()) and (s.role in ('admin','publisher') or (s.role='editor' and status<>'published')))
);
create index if not exists cumilla_profiles_photo_path on public.cumilla_profiles(photo_path) where photo_path is not null;
