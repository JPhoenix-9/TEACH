create table public.teach_blueprint_lessons (
 source_step_id uuid primary key,
 source_section_id uuid not null,
 module_title text not null,
 module_position integer not null,
 title text not null,
 position integer not null,
 video_url text check(video_url is null or video_url ~ '^https://video[.]wixstatic[.]com/video/[A-Za-z0-9_-]+/[0-9]+p/mp4/file[.]mp4$'),
 poster_url text check(poster_url is null or poster_url ~ '^https://static[.]wixstatic[.]com/media/[A-Za-z0-9_.~-]+$'),
 duration_seconds double precision,
 original_content jsonb not null,
 published boolean not null default false,
 imported_at timestamptz not null default now()
);
alter table public.teach_blueprint_lessons enable row level security;
revoke all on public.teach_blueprint_lessons from public,anon,authenticated;
grant select on public.teach_blueprint_lessons to authenticated;
grant all on public.teach_blueprint_lessons to service_role;
create policy blueprint_lesson_read on public.teach_blueprint_lessons for select to authenticated using (
 exists(select 1 from public.teach_administrators a where a.user_id=(select auth.uid()))
 or (published and exists(select 1 from public.product_access p where p.user_id=(select auth.uid()) and p.product_key='blueprint' and p.revoked_at is null))
);
comment on table public.teach_blueprint_lessons is 'Copied Homeschool-911 Blueprint lesson content. Videos still hosted on Wix; this is not a video-file evacuation.';

