-- Trusted administrators are assigned privately; no browser can create an admin.
create table public.teach_administrators(user_id uuid primary key references auth.users(id),created_at timestamptz not null default now());
alter table public.teach_administrators enable row level security;
revoke all on public.teach_administrators from public,anon,authenticated;
grant select on public.teach_administrators to authenticated;
grant all on public.teach_administrators to service_role;
create policy administrator_self on public.teach_administrators for select to authenticated using(user_id=(select auth.uid()));
create policy administrator_wishes on public.family_wishes for select to authenticated using(exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));

create table public.teach_webinars(slug text primary key check(slug in('5-shifts','common-questions')),title text not null,ready boolean not null default false);
insert into public.teach_webinars(slug,title) values('5-shifts','5 Shifts to Stress-Free Homeschooling'),('common-questions','Can I Really Homeschool? Your Top 10 Questions Answered');
alter table public.teach_webinars enable row level security;
revoke all on public.teach_webinars from public,anon,authenticated;
grant select on public.teach_webinars to anon,authenticated;
grant update on public.teach_webinars to authenticated;
grant all on public.teach_webinars to service_role;
create policy webinar_catalog on public.teach_webinars for select to anon,authenticated using(true);
create policy webinar_admin_update on public.teach_webinars for update to authenticated using(exists(select 1 from public.teach_administrators where user_id=(select auth.uid()))) with check(exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));

create table public.webinar_registrations(
 user_id uuid not null references public.family_profiles(user_id),webinar_slug text not null references public.teach_webinars(slug),
 first_name text not null check(length(trim(first_name))>0),email_permission boolean not null check(email_permission),
 consent_version text not null check(consent_version='teach-webinar-2026-10-22'),
 consent_wording text not null check(consent_wording='Yes, I agree to receive emails from TEACH with homeschooling guidance, news, and offers. I can unsubscribe at any time.'),
 registered_at timestamptz not null default now(),primary key(user_id,webinar_slug)
);
alter table public.webinar_registrations enable row level security;
revoke all on public.webinar_registrations from public,anon,authenticated;
grant select,insert on public.webinar_registrations to authenticated;
grant all on public.webinar_registrations to service_role;
create policy registration_read on public.webinar_registrations for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));
create policy registration_create on public.webinar_registrations for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.teach_webinars w where w.slug=webinar_slug and w.ready));

create table public.teach_materials(
 id uuid primary key default gen_random_uuid(),product_key text,webinar_slug text references public.teach_webinars(slug),
 title text not null,storage_path text not null unique,kind text not null check(kind in('video','document')),position integer not null default 0,published boolean not null default false,
 check((product_key is null)<>(webinar_slug is null)),
 check(product_key is null or product_key in('blueprint','gap-k2','gap-35','gap-68','gap-912'))
);
alter table public.teach_materials enable row level security;
revoke all on public.teach_materials from public,anon,authenticated;
grant select,insert,update on public.teach_materials to authenticated;
grant all on public.teach_materials to service_role;
create policy material_read on public.teach_materials for select to authenticated using(
 exists(select 1 from public.teach_administrators where user_id=(select auth.uid())) or
 (published and ((product_key is not null and exists(select 1 from public.product_access a where a.user_id=(select auth.uid()) and a.product_key=teach_materials.product_key and a.revoked_at is null)) or
 (webinar_slug is not null and exists(select 1 from public.webinar_registrations r join public.teach_webinars w on w.slug=r.webinar_slug where r.user_id=(select auth.uid()) and r.webinar_slug=teach_materials.webinar_slug and w.ready)))));
create policy material_admin_create on public.teach_materials for insert to authenticated with check(exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));
create policy material_admin_update on public.teach_materials for update to authenticated using(exists(select 1 from public.teach_administrators where user_id=(select auth.uid()))) with check(exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));

insert into storage.buckets(id,name,public) values('teach-resources','teach-resources',false) on conflict(id) do nothing;
create policy teach_resource_read on storage.objects for select to authenticated using(bucket_id='teach-resources' and exists(select 1 from public.teach_materials m where m.storage_path=name));
create policy teach_resource_admin_upload on storage.objects for insert to authenticated with check(bucket_id='teach-resources' and exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));
-- Replacements must use a new versioned filename, preserving prior source files.

create function public.register_teach_webinar(p_slug text,p_first_name text,p_email_permission boolean)
returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null or p_email_permission is distinct from true then raise exception 'Please log in and confirm email permission to register.';end if;
 if not exists(select 1 from public.teach_webinars where slug=p_slug and ready) then raise exception 'This webinar is not open for registration yet.';end if;
 update public.family_profiles set marketing_opt_in=true where user_id=auth.uid();
 if not found then raise exception 'Please complete your family profile first.';end if;
 insert into public.webinar_registrations(user_id,webinar_slug,first_name,email_permission,consent_version,consent_wording)
 values(auth.uid(),p_slug,trim(p_first_name),true,'teach-webinar-2026-10-22','Yes, I agree to receive emails from TEACH with homeschooling guidance, news, and offers. I can unsubscribe at any time.') on conflict(user_id,webinar_slug) do nothing;
end $$;
revoke all on function public.register_teach_webinar(text,text,boolean) from public,anon,authenticated;
grant execute on function public.register_teach_webinar(text,text,boolean) to authenticated;

create table public.family_support_messages(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.family_profiles(user_id),
 subject text not null check(length(trim(subject)) between 1 and 150),message text not null check(length(trim(message)) between 1 and 6000),created_at timestamptz not null default now()
);
alter table public.family_support_messages enable row level security;
revoke all on public.family_support_messages from public,anon,authenticated;
grant select,insert on public.family_support_messages to authenticated;
grant all on public.family_support_messages to service_role;
create policy support_read on public.family_support_messages for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.teach_administrators where user_id=(select auth.uid())));
create policy support_create on public.family_support_messages for insert to authenticated with check(user_id=(select auth.uid()));
create index support_user_date on public.family_support_messages(user_id,created_at);
