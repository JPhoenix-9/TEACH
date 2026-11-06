-- Use real trusted TEACH entitlements; Planner-only access is private Ask Jana only.
create or replace function private.porch_member() returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (
  private.porch_staff()
  or exists(select 1 from public.product_access where user_id=auth.uid() and revoked_at is null
   and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912','activity-generator'))
  or exists(select 1 from public.transcript_licenses where user_id=auth.uid()
   and revoked_at is null and purchased_at<=now() and expires_at>now())
 );
$$;

create or replace function private.ask_jana_member() returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (
  private.porch_member()
  or exists(select 1 from public.planner_subscriptions where user_id=auth.uid()
   and revoked_at is null and starts_at<=now() and ends_at>now())
 );
$$;
revoke all on function private.porch_member(),private.ask_jana_member() from public,anon,authenticated;
grant execute on function private.porch_member(),private.ask_jana_member() to authenticated;

create or replace function private.porch_reply_member(p_thread_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(
  select 1 from public.porch_threads t where t.id=p_thread_id
   and (not t.hidden or t.user_id=auth.uid() or private.porch_staff())
   and case when t.channel='ask-jana'
    then private.ask_jana_member() and (t.user_id=auth.uid() or private.porch_staff())
    else private.porch_member() end
 );
$$;
revoke all on function private.porch_reply_member(uuid) from public,anon,authenticated;
grant execute on function private.porch_reply_member(uuid) to authenticated;

-- Owners can remove their own content without receiving permission to restore
-- content hidden by staff or to update any message/identity fields.
create or replace function private.hide_own_porch_message(p_kind text,p_id uuid) returns void
language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); allowed boolean;
begin
 if owner_id is null or p_id is null or p_kind is null or p_kind not in ('thread','reply') then
  raise exception 'Message access required' using errcode='42501';
 end if;
 if p_kind='thread' then
  select case when t.channel='ask-jana' then private.ask_jana_member() else private.porch_member() end
   into allowed from public.porch_threads t where t.id=p_id and t.user_id=owner_id;
  if not coalesce(allowed,false) then raise exception 'Message access required' using errcode='42501';end if;
  update public.porch_threads set hidden=true where id=p_id and user_id=owner_id;
 else
  select private.porch_reply_member(r.thread_id) into allowed
   from public.porch_replies r where r.id=p_id and r.user_id=owner_id;
  if not coalesce(allowed,false) then raise exception 'Message access required' using errcode='42501';end if;
  update public.porch_replies set hidden=true where id=p_id and user_id=owner_id;
 end if;
end;$$;
create or replace function public.hide_own_porch_message(p_kind text,p_id uuid) returns void
language sql security invoker set search_path='' as $$select private.hide_own_porch_message(p_kind,p_id);$$;
revoke all on function private.hide_own_porch_message(text,uuid),public.hide_own_porch_message(text,uuid) from public,anon,authenticated;
grant execute on function private.hide_own_porch_message(text,uuid),public.hide_own_porch_message(text,uuid) to authenticated;
notify pgrst,'reload schema';
