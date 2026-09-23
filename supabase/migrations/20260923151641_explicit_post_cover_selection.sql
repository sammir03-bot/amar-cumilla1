alter table public.cumilla_posts add column cover_selection text;
alter table public.cumilla_posts add constraint cumilla_post_cover_selection_check check (
 cover_selection is null or cover_selection in ('none','external') or
 (cover_selection = any(media_paths) and cover_selection ~ '\.(jpg|png|webp)$')
);
comment on column public.cumilla_posts.cover_selection is 'Explicit cover: none, external, or an attached image path. NULL preserves legacy selection.';
