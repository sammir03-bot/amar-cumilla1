update storage.buckets set file_size_limit=8388608 where id='cumilla-media';
create policy cumilla_media_cleanup_own_unused on storage.objects for delete to authenticated using (
 bucket_id='cumilla-media' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.cumilla_staff where user_id=(select auth.uid()))
 and not exists(select 1 from public.cumilla_posts where storage.objects.name=any(media_paths))
);
