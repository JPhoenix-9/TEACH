create schema if not exists teach_transcript_private;
revoke all on schema teach_transcript_private from public,anon,authenticated;
create table teach_transcript_private.configuration(id boolean primary key default true check(id),signing_key text not null);
revoke all on teach_transcript_private.configuration from public,anon,authenticated;
-- Provision signing_key outside source control; matches TRANSCRIPT_RESEARCH_SECRET.
-- Only entitlement/usage metadata is retained. No student names or academic records.
create table public.transcript_licenses (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id),
 project_id uuid unique, purchased_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '3 years'),
 order_reference text unique, revoked_at timestamptz,
 check(expires_at>purchased_at)
);
create index transcript_license_owner on public.transcript_licenses(user_id);
alter table public.transcript_licenses enable row level security;
revoke all on public.transcript_licenses from public,anon,authenticated;
grant select on public.transcript_licenses to authenticated;
grant all on public.transcript_licenses to service_role;
create policy transcript_license_read on public.transcript_licenses for select to authenticated using(user_id=(select auth.uid()));
create table public.transcript_schools (
 license_id uuid not null references public.transcript_licenses(id),institution_key text not null check(length(institution_key) between 3 and 300),checked_at timestamptz not null default now(),primary key(license_id,institution_key)
);
alter table public.transcript_schools enable row level security;
revoke all on public.transcript_schools from public,anon,authenticated;
grant select on public.transcript_schools to authenticated;
grant all on public.transcript_schools to service_role;
create policy transcript_school_read on public.transcript_schools for select to authenticated using(exists(select 1 from public.transcript_licenses l where l.id=license_id and l.user_id=(select auth.uid())));
create table public.transcript_requests(license_id uuid primary key references public.transcript_licenses(id),bucket date not null default current_date,count integer not null default 0,last_at timestamptz);
alter table public.transcript_requests enable row level security;
revoke all on public.transcript_requests from public,anon,authenticated;
grant all on public.transcript_requests to service_role;
-- Admin-only development licenses. Purchasing customers cannot self-grant access.
create function public.create_transcript_staff_license() returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if auth.uid() is null or not exists(select 1 from public.teach_administrators where user_id=auth.uid()) then raise exception 'Administrator access required'; end if;
 insert into public.transcript_licenses(user_id,order_reference) values(auth.uid(),'staff:'||gen_random_uuid()::text) returning id into result;return result;
end;$$;
create function public.bind_transcript_project(p_license uuid,p_project uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or p_project is null then raise exception 'Sign in to open this student project'; end if;
 perform 1 from public.transcript_licenses where id=p_license and user_id=auth.uid() and revoked_at is null and purchased_at<=now() and expires_at>now() for update;
 if not found then raise exception 'An active student purchase is required'; end if;
 update public.transcript_licenses set project_id=p_project where id=p_license and (project_id is null or project_id=p_project);
 if not found then raise exception 'This purchase is already associated with a student project. Open its saved project file.';end if;
end;$$;
-- Called with the user's JWT. Project-file dates/usage cannot grant or extend access.
create function public.reserve_transcript_request(p_license uuid,p_project uuid) returns void language plpgsql security definer set search_path='' as $$
declare n integer; recent timestamptz;
begin
 if auth.uid() is null then raise exception 'Please sign in again';end if;
 perform 1 from public.transcript_licenses where id=p_license and project_id=p_project and user_id=auth.uid() and revoked_at is null and purchased_at<=now() and expires_at>now() for update;
 if not found then raise exception 'An active purchase for this student project is required';end if;
 select case when bucket=current_date then count else 0 end,last_at into n,recent from public.transcript_requests where license_id=p_license;
 if n>=100 or recent>now()-interval '3 seconds' then raise exception 'Please pause before trying again. Daily limit: 100 requests.';end if;
 insert into public.transcript_requests(license_id,bucket,count,last_at) values(p_license,current_date,1,now()) on conflict(license_id) do update set bucket=current_date,count=case when public.transcript_requests.bucket=current_date then public.transcript_requests.count+1 else 1 end,last_at=now();
end;$$;
-- Only the server may commit verified, successfully researched institutions.
create function public.commit_transcript_school(p_user uuid,p_license uuid,p_project uuid,p_institution text,p_expiry bigint,p_signature text) returns integer language plpgsql security definer set search_path='' as $$
declare n integer; signing_key text; payload text;
begin
 if auth.uid() is distinct from p_user or p_expiry<extract(epoch from now())::bigint or p_expiry>extract(epoch from now())::bigint+900 then raise exception 'School verification expired. Please research this school again.';end if;
 select c.signing_key into signing_key from teach_transcript_private.configuration c where id=true;
 payload:=p_user::text||'|'||p_license::text||'|'||p_project::text||'|'||p_institution||'|'||p_expiry::text;
 if signing_key is null or p_signature is distinct from encode(extensions.hmac(convert_to(payload,'UTF8'),convert_to(signing_key,'UTF8'),'sha256'),'hex') then raise exception 'Verified school research required';end if;
 perform 1 from public.transcript_licenses where id=p_license and project_id=p_project and user_id=p_user and revoked_at is null and purchased_at<=now() and expires_at>now() for update;
 if not found then raise exception 'Active student project required';end if;
 select count(*) into n from public.transcript_schools where license_id=p_license;
 if exists(select 1 from public.transcript_schools where license_id=p_license and institution_key=p_institution) then
 update public.transcript_schools set checked_at=now() where license_id=p_license and institution_key=p_institution;return n;end if;
 if n>=12 then raise exception 'All 12 unique college checks have been used. You can recheck any previously checked institution.';end if;
 insert into public.transcript_schools(license_id,institution_key) values(p_license,p_institution);return n+1;
end;$$;
revoke all on function public.create_transcript_staff_license(),public.bind_transcript_project(uuid,uuid),public.reserve_transcript_request(uuid,uuid),public.commit_transcript_school(uuid,uuid,uuid,text,bigint,text) from public,anon,authenticated;
grant execute on function public.create_transcript_staff_license(),public.bind_transcript_project(uuid,uuid),public.reserve_transcript_request(uuid,uuid) to authenticated;
grant execute on function public.commit_transcript_school(uuid,uuid,uuid,text,bigint,text) to authenticated;
