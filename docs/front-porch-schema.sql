-- Front Porch: private purchaser community. Apply to the TEACH project only.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create function private.porch_staff() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.teach_administrators where user_id=auth.uid());
$$;
create function private.porch_member() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (private.porch_staff() or exists(select 1 from public.product_access where user_id=auth.uid() and revoked_at is null and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912')));
$$;
revoke all on function private.porch_staff(),private.porch_member() from public,anon;
grant execute on function private.porch_staff(),private.porch_member() to authenticated;
create function public.front_porch_access() returns jsonb language sql stable security invoker set search_path='' as $$
 select jsonb_build_object('member',private.porch_member(),'staff',private.porch_staff());
$$;
revoke all on function public.front_porch_access() from public,anon;
grant execute on function public.front_porch_access() to authenticated;

create table public.porch_threads (
 id uuid primary key default gen_random_uuid(),
 channel text not null check(channel in ('support','curriculum','generators','blueprint','ask-jana')),
 user_id uuid not null references auth.users(id),
 author_name text not null default '', author_staff boolean not null default false,
 title text not null check(char_length(btrim(title)) between 1 and 160),
 body text not null check(char_length(btrim(body)) between 1 and 6000),
 created_at timestamptz not null default now(), hidden boolean not null default false
);
create table public.porch_replies (
 id uuid primary key default gen_random_uuid(),
 thread_id uuid not null references public.porch_threads(id),
 user_id uuid not null references auth.users(id),
 author_name text not null default '', author_staff boolean not null default false,
 body text not null check(char_length(btrim(body)) between 1 and 6000),
 created_at timestamptz not null default now(), hidden boolean not null default false
);
create index porch_threads_channel_date on public.porch_threads(channel,created_at desc,id);
create index porch_threads_user on public.porch_threads(user_id);
create index porch_replies_thread_date on public.porch_replies(thread_id,created_at,id);
create index porch_replies_user on public.porch_replies(user_id);
alter table public.porch_threads enable row level security;
alter table public.porch_replies enable row level security;
revoke all on public.porch_threads,public.porch_replies from anon,authenticated;
grant select,insert on public.porch_threads,public.porch_replies to authenticated;
grant update(hidden) on public.porch_threads,public.porch_replies to authenticated;

create policy porch_threads_read on public.porch_threads for select to authenticated using (
 (select private.porch_member()) and (not hidden or (select private.porch_staff()))
 and (channel<>'ask-jana' or user_id=(select auth.uid()) or (select private.porch_staff()))
);
create policy porch_threads_write on public.porch_threads for insert to authenticated with check (
 (select private.porch_member()) and user_id=(select auth.uid()) and not hidden
);
create policy porch_threads_hide on public.porch_threads for update to authenticated
 using ((select private.porch_member()) and (user_id=(select auth.uid()) or (select private.porch_staff())))
 with check ((select private.porch_member()) and (user_id=(select auth.uid()) or (select private.porch_staff())));
create policy porch_replies_read on public.porch_replies for select to authenticated using (
 (select private.porch_member()) and (not hidden or (select private.porch_staff()))
 and exists(select 1 from public.porch_threads t where t.id=thread_id)
);
create policy porch_replies_write on public.porch_replies for insert to authenticated with check (
 (select private.porch_member()) and user_id=(select auth.uid()) and not hidden
 and exists(select 1 from public.porch_threads t where t.id=thread_id and not t.hidden)
);
create policy porch_replies_hide on public.porch_replies for update to authenticated
 using ((select private.porch_member()) and (user_id=(select auth.uid()) or (select private.porch_staff())))
 with check ((select private.porch_member()) and (user_id=(select auth.uid()) or (select private.porch_staff())));

-- Trusted identity snapshot; clients cannot impersonate staff or forge timestamps.
create function private.porch_stamp() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.porch_member() then raise exception 'A qualifying purchase is required.' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,42));
 if not private.porch_staff() and (
 exists(select 1 from public.porch_threads where user_id=auth.uid() and created_at>clock_timestamp()-interval '10 seconds') or
 exists(select 1 from public.porch_replies where user_id=auth.uid() and created_at>clock_timestamp()-interval '10 seconds')) then
 raise exception 'Please wait a few seconds before posting again.' using errcode='P0001'; end if;
 new.user_id:=auth.uid(); new.author_staff:=private.porch_staff(); new.created_at:=clock_timestamp(); new.hidden:=false;
 if new.author_staff then new.author_name:='Jana';
 else select split_part(btrim(parent_name),' ',1) into new.author_name from public.family_profiles where user_id=auth.uid();
 new.author_name:=left(coalesce(nullif(new.author_name,''),'TEACH parent'),60); end if;
 return new;
end;
$$;
revoke all on function private.porch_stamp() from public,anon,authenticated;
create trigger porch_threads_stamp before insert on public.porch_threads for each row execute function private.porch_stamp();
create trigger porch_replies_stamp before insert on public.porch_replies for each row execute function private.porch_stamp();
