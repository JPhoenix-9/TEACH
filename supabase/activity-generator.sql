-- Additive Activity Generator storage; existing family and Planner records are preserved.
alter table public.product_access drop constraint product_access_product_key_check;
alter table public.product_access add constraint product_access_product_key_check check(product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912','activity-generator'));
create table public.product_profile_requirements(product_key text primary key, needs_learning_profile boolean not null default false);
insert into public.product_profile_requirements values ('activity-generator',true);
alter table public.product_profile_requirements enable row level security;
grant select on public.product_profile_requirements to authenticated;
grant all on public.product_profile_requirements to service_role;
create policy profile_requirements_read on public.product_profile_requirements for select to authenticated using(true);
create function public.has_activity_access() returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.product_access where user_id=(select auth.uid()) and product_key='activity-generator' and revoked_at is null);
$$;
create function public.needs_learning_profile() returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.product_access a join public.product_profile_requirements r using(product_key) where a.user_id=(select auth.uid()) and a.revoked_at is null and r.needs_learning_profile);
$$;
revoke all on function public.has_activity_access(),public.needs_learning_profile() from public,anon;
grant execute on function public.has_activity_access(),public.needs_learning_profile() to authenticated;
create table public.child_learning_profiles(
 user_id uuid not null, child_id uuid primary key, details jsonb not null check(jsonb_typeof(details)='object' and octet_length(details::text)<=20000), updated_at timestamptz not null default now(),
 foreign key(user_id,child_id) references public.family_children(user_id,id)
);
alter table public.child_learning_profiles enable row level security;
grant select,insert,update on public.child_learning_profiles to authenticated;
grant all on public.child_learning_profiles to service_role;
create policy learning_read on public.child_learning_profiles for select to authenticated using(user_id=(select auth.uid()) and public.needs_learning_profile());
create policy learning_insert on public.child_learning_profiles for insert to authenticated with check(user_id=(select auth.uid()) and public.needs_learning_profile());
create policy learning_update on public.child_learning_profiles for update to authenticated using(user_id=(select auth.uid()) and public.needs_learning_profile()) with check(user_id=(select auth.uid()) and public.needs_learning_profile());
create table public.activity_plans(
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.family_profiles(user_id), title text not null check(length(title) between 1 and 200), kind text not null check(kind in('activity','trip')), plan jsonb not null check(octet_length(plan::text)<=100000), created_at timestamptz not null default now()
);
create index activity_plans_owner_date on public.activity_plans(user_id,created_at desc);
alter table public.activity_plans enable row level security;
grant select,insert,delete on public.activity_plans to authenticated;
grant all on public.activity_plans to service_role;
create policy plans_read on public.activity_plans for select to authenticated using(user_id=(select auth.uid()));
create policy plans_insert on public.activity_plans for insert to authenticated with check(user_id=(select auth.uid()) and public.has_activity_access());
create policy plans_delete on public.activity_plans for delete to authenticated using(user_id=(select auth.uid()));
create table public.activity_requests(user_id uuid not null references public.family_profiles(user_id), bucket date not null default current_date, count integer not null default 0,last_at timestamptz, primary key(user_id,bucket));
alter table public.activity_requests enable row level security;
revoke all on public.activity_requests from public,anon,authenticated;
-- The limiter is a narrowly scoped privileged operation; no profile or plan data is exposed.
create function public.reserve_activity_request() returns void language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); recent timestamptz; total integer;
begin
 if owner_id is null or not exists(select 1 from public.product_access where user_id=owner_id and product_key='activity-generator' and revoked_at is null) then raise exception 'Activity Generator purchase required'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||'activity_request',0));
 select count,last_at into total,recent from public.activity_requests where user_id=owner_id and bucket=current_date;
 if total>=100 or recent>now()-interval '3 seconds' then raise exception 'Please wait before generating again. Daily limit: 100 requests.'; end if;
 insert into public.activity_requests(user_id,bucket,count,last_at) values(owner_id,current_date,1,now()) on conflict(user_id,bucket) do update set count=public.activity_requests.count+1,last_at=now();
end;$$;
revoke all on function public.reserve_activity_request() from public,anon;
grant execute on function public.reserve_activity_request() to authenticated;
-- Append only; lock the same owner/date key as the existing Planner save operation.
create function public.append_activity_note(p_day date,p_note text,p_child_ids uuid[],p_family boolean,p_request_id uuid) returns void language plpgsql security invoker set search_path='' as $$
declare owner_id uuid:=auth.uid(); cid uuid;
begin
 if owner_id is null or not public.has_activity_access() then raise exception 'Activity Generator purchase required'; end if;
 if p_day is null or length(trim(p_note)) not between 1 and 5000 or p_request_id is null or (not p_family and coalesce(cardinality(p_child_ids),0)=0) then raise exception 'Choose a date and at least one recipient, and enter a note'; end if;
 if not exists(select 1 from public.planner_subscriptions where user_id=owner_id and revoked_at is null and starts_at<=now() and ends_at>now()) then raise exception 'An active Planner subscription is required to add notes. Your activity can still be saved.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||p_day::text,0));
 if exists(select 1 from public.activity_note_receipts where user_id=owner_id and request_id=p_request_id) then return; end if;
 foreach cid in array coalesce(p_child_ids,'{}') loop
  if not exists(select 1 from public.family_children where user_id=owner_id and id=cid and archived_at is null) then raise exception 'Choose children from your active family profile'; end if;
 end loop;
 insert into public.planner_days(user_id,day,family_note) values(owner_id,p_day,case when p_family then trim(p_note) else '' end)
 on conflict(user_id,day) do update set family_note=case when p_family then concat_ws(E'\n\n',nullif(public.planner_days.family_note,''),trim(p_note)) else public.planner_days.family_note end;
 foreach cid in array coalesce(p_child_ids,'{}') loop
  insert into public.planner_child_days(user_id,child_id,day,note) values(owner_id,cid,p_day,trim(p_note)) on conflict(user_id,child_id,day) do update set note=concat_ws(E'\n\n',nullif(public.planner_child_days.note,''),trim(p_note));
 end loop;
 insert into public.activity_note_receipts(user_id,request_id) values(owner_id,p_request_id);
end;$$;
create table public.activity_note_receipts(user_id uuid not null references public.family_profiles(user_id),request_id uuid not null,primary key(user_id,request_id));
alter table public.activity_note_receipts enable row level security;
grant select,insert on public.activity_note_receipts to authenticated;
create policy receipts_read on public.activity_note_receipts for select to authenticated using(user_id=(select auth.uid()));
create policy receipts_insert on public.activity_note_receipts for insert to authenticated with check(user_id=(select auth.uid()) and public.has_activity_access());
revoke all on function public.append_activity_note(date,text,uuid[],boolean,uuid) from public,anon;
grant execute on function public.append_activity_note(date,text,uuid[],boolean,uuid) to authenticated;
