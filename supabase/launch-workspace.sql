-- TEACH project jhooodlcvcpnzcpreqmu only. Paid access is server-managed.
create function public.save_planner_day(p_day date,p_expected_revision bigint,p_calendar_note text,p_family_note text,p_children jsonb)
returns bigint language plpgsql security invoker set search_path='' as $$
declare owner_id uuid:=auth.uid(); current_revision bigint; next_revision bigint; child jsonb;
begin
 if owner_id is null then raise exception 'Please log in again'; end if;
 if p_day is null or p_expected_revision is null or p_expected_revision<0 or jsonb_typeof(p_children) is distinct from 'array' then raise exception 'Invalid planner entry'; end if;
 if not exists(select 1 from public.planner_subscriptions where user_id=owner_id and starts_at<=now() and ends_at>now() and revoked_at is null) then raise exception 'Your Planner is read-only. Your saved records remain available.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||p_day::text,0));
 select revision into current_revision from public.planner_days where user_id=owner_id and day=p_day for update;
 if coalesce(current_revision,0)<>p_expected_revision then raise exception 'PLANNER_CONFLICT: This date was changed on another device. Your unsaved text is still on this screen.'; end if;
 insert into public.planner_days(user_id,day,calendar_note,family_note) values(owner_id,p_day,coalesce(p_calendar_note,''),coalesce(p_family_note,''))
 on conflict(user_id,day) do update set calendar_note=excluded.calendar_note,family_note=excluded.family_note returning revision into next_revision;
 for child in select value from jsonb_array_elements(p_children) loop
  if not exists(select 1 from public.family_children where user_id=owner_id and id=(child->>'id')::uuid and archived_at is null) then raise exception 'This child is not active in your family profile. Refresh your profile before trying again.'; end if;
  insert into public.planner_child_days(user_id,child_id,day,schooled,note) values(owner_id,(child->>'id')::uuid,p_day,coalesce((child->>'schooled')::boolean,false),coalesce(child->>'note',''))
  on conflict(user_id,child_id,day) do update set schooled=excluded.schooled,note=excluded.note;
 end loop;
 return next_revision;
end $$;
revoke all on function public.save_planner_day(date,bigint,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.save_planner_day(date,bigint,text,text,jsonb) to authenticated;

-- No purchase or community access is granted through profile fields or browser flags.
create table public.product_access (
 user_id uuid not null references public.family_profiles(user_id),
 product_key text not null check(product_key in('blueprint','gap-k2','gap-35','gap-68','gap-912')),
 granted_at timestamptz not null default now(), revoked_at timestamptz,
 primary key(user_id,product_key)
);
alter table public.product_access enable row level security;
revoke all on public.product_access from public,anon,authenticated;
grant select on public.product_access to authenticated;
grant all on public.product_access to service_role;
create policy product_access_read on public.product_access for select to authenticated using(user_id=(select auth.uid()));

create table public.family_wishes (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.family_profiles(user_id),
 wish text not null check(length(trim(wish)) between 1 and 4000),
 created_at timestamptz not null default now()
);
alter table public.family_wishes enable row level security;
revoke all on public.family_wishes from public,anon,authenticated;
grant select,insert on public.family_wishes to authenticated;
grant all on public.family_wishes to service_role;
create policy wishes_read on public.family_wishes for select to authenticated using(user_id=(select auth.uid()));
create policy wishes_create on public.family_wishes for insert to authenticated with check(user_id=(select auth.uid()));
create index family_wishes_user_date on public.family_wishes(user_id,created_at);
