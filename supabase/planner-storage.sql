-- TEACH only: project jhooodlcvcpnzcpreqmu. Applied through a named remote migration.
-- Account deletion is an explicit administrative operation, not a subscription lapse.
create schema if not exists teach_private;
revoke all on schema teach_private from public, anon, authenticated;

create table public.family_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  parent_name text not null check (length(trim(parent_name)) > 0),
  phone text not null default '',
  child_count integer not null default 0 check (child_count >= 0),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.family_children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.family_profiles(user_id),
  name text not null check (length(trim(name)) > 0),
  age_years smallint check (age_years >= 0),
  grade_level text not null default '',
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,id)
);
create table public.planner_subscriptions (
  user_id uuid primary key references public.family_profiles(user_id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  revoked_at timestamptz,
  check (ends_at > starts_at)
);
create table public.planner_days (
  user_id uuid not null references public.family_profiles(user_id),
  day date not null,
  calendar_note text not null default '',
  family_note text not null default '',
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key(user_id,day)
);
create table public.planner_child_days (
  user_id uuid not null,
  child_id uuid not null,
  day date not null,
  schooled boolean not null default false,
  note text not null default '',
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key(user_id,child_id,day),
  foreign key(user_id,child_id) references public.family_children(user_id,id)
);
create index planner_child_days_by_date on public.planner_child_days(user_id,day);
create index planner_child_days_child_fk on public.planner_child_days(child_id);

create function teach_private.touch_updated_at() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create function teach_private.touch_planner_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  new.revision = old.revision + 1;
  return new;
end;
$$;
revoke all on all functions in schema teach_private from public, anon, authenticated;
create trigger family_profiles_updated before update on public.family_profiles
for each row execute function teach_private.touch_updated_at();
create trigger family_children_updated before update on public.family_children
for each row execute function teach_private.touch_updated_at();
create trigger planner_days_updated before update on public.planner_days
for each row execute function teach_private.touch_planner_revision();
create trigger planner_child_days_updated before update on public.planner_child_days
for each row execute function teach_private.touch_planner_revision();

alter table public.family_profiles enable row level security;
alter table public.family_children enable row level security;
alter table public.planner_subscriptions enable row level security;
alter table public.planner_days enable row level security;
alter table public.planner_child_days enable row level security;
revoke all on public.family_profiles, public.family_children, public.planner_subscriptions,
 public.planner_days, public.planner_child_days from public, anon, authenticated;
grant select, insert, update on public.family_profiles, public.family_children,
 public.planner_days, public.planner_child_days to authenticated;
grant select on public.planner_subscriptions to authenticated;
grant all on public.family_profiles, public.family_children, public.planner_subscriptions,
 public.planner_days, public.planner_child_days to service_role;

create policy profile_read on public.family_profiles for select to authenticated
 using (user_id = (select auth.uid()));
create policy profile_create on public.family_profiles for insert to authenticated
 with check (user_id = (select auth.uid()));
create policy profile_update on public.family_profiles for update to authenticated
 using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy children_read on public.family_children for select to authenticated
 using (user_id = (select auth.uid()));
create policy children_create on public.family_children for insert to authenticated
 with check (user_id = (select auth.uid()));
create policy children_update on public.family_children for update to authenticated
 using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy subscription_read on public.planner_subscriptions for select to authenticated
 using (user_id = (select auth.uid()));

-- History stays readable after renewal lapses. Trusted server-managed subscriptions
-- authorize writes; editable profile fields and user_metadata never authorize them.
create policy days_read on public.planner_days for select to authenticated
 using (user_id = (select auth.uid()));
create policy days_create on public.planner_days for insert to authenticated
 with check (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null));
create policy days_update on public.planner_days for update to authenticated
 using (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null))
 with check (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null));
create policy child_days_read on public.planner_child_days for select to authenticated
 using (user_id = (select auth.uid()));
create policy child_days_create on public.planner_child_days for insert to authenticated
 with check (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null));
create policy child_days_update on public.planner_child_days for update to authenticated
 using (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null))
 with check (user_id = (select auth.uid()) and exists (
  select 1 from public.planner_subscriptions s where s.user_id = (select auth.uid())
  and s.starts_at <= now() and s.ends_at > now() and s.revoked_at is null));

-- The dashboard-installed event trigger does not need a browser-callable endpoint.
do $$ begin
 if to_regprocedure('public.rls_auto_enable()') is not null then
  revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
 end if;
end $$;
