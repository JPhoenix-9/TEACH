begin;
-- Apply first in the TEACH test database. A complete Blueprint qualifies; its individual modules do not.
create or replace function public.reserve_teach_order(p_user uuid,p_key text,p_origin text) returns public.teach_orders language plpgsql security invoker set search_path='' as $$
declare c public.teach_price_catalog; o public.teach_orders; discounted boolean; bundle boolean := p_key in ('gap-bundle-k2','gap-bundle-35','gap-bundle-68','gap-bundle-912');
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text,0));
 if not exists(select 1 from public.family_profiles where user_id=p_user and length(trim(parent_name))>0) then raise exception 'profile_required'; end if;
 select * into c from public.teach_price_catalog where product_key=p_key;
 if not found or (p_key like 'gap-bundle-%' and not bundle) then raise exception 'unknown_product'; end if;
 if exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and (product_key=p_key or (p_key like 'blueprint-module-%' and product_key='blueprint'))) then raise exception 'already_owned'; end if;
 update public.teach_orders set state='expired' where user_id=p_user and state='reserved' and expires_at<=now();
 select * into o from public.teach_orders where user_id=p_user and product_key=p_key and state='reserved' order by created_at desc limit 1;
 if found then return o; end if;
 if bundle and exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912')) then raise exception 'bundle_requires_first_gap'; end if;
 if bundle and exists(select 1 from public.teach_orders where user_id=p_user and product_key='blueprint' and state='reserved') then raise exception 'finish_pending_blueprint_order'; end if;
 if p_key='blueprint' and exists(select 1 from public.teach_orders where user_id=p_user and product_key like 'gap-bundle-%' and state='reserved') then raise exception 'finish_pending_blueprint_gap_order'; end if;
 -- Finish a pending GAP purchase before quoting another grade band.
 if p_key like 'gap-%' and exists(select 1 from public.teach_orders where user_id=p_user and product_key like 'gap-%' and state='reserved') then raise exception 'finish_pending_gap_order'; end if;
 select exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912')) into discounted;
 insert into public.teach_orders(user_id,product_key,price_id,amount,currency,return_origin)
 values(p_user,p_key,case when p_key like 'gap-%' and not bundle and discounted then c.additional_price_id else c.price_id end,case when p_key like 'gap-%' and not bundle and discounted then 4999 else c.amount end,c.currency,p_origin) returning * into o;
 return o;
end $$;
revoke all on function public.reserve_teach_order(uuid,text,text) from public,anon,authenticated;
grant execute on function public.reserve_teach_order(uuid,text,text) to service_role;


create or replace function public.fulfill_teach_order(p_order uuid,p_session text,p_price text,p_amount integer,p_event text) returns boolean language plpgsql security invoker set search_path='' as $$
declare o public.teach_orders;
begin
 select * into o from public.teach_orders where id=p_order for update;
 if not found or o.price_id<>p_price or o.amount<>p_amount or (o.checkout_session_id is not null and o.checkout_session_id<>p_session) then raise exception 'order_mismatch'; end if;
 if o.state='paid' then return true; end if;
 insert into public.teach_payment_events(event_id,order_id) values(p_event,p_order) on conflict do nothing;
 if not found then return false; end if;
 if o.product_key='transcript-architect' then
  insert into public.transcript_licenses(user_id,order_reference) values(o.user_id,o.id::text) on conflict(order_reference) do nothing;
 elsif o.product_key in ('gap-bundle-k2','gap-bundle-35','gap-bundle-68','gap-bundle-912') then
  insert into public.product_access(user_id,product_key,revoked_at)
  values(o.user_id,'blueprint',null),(o.user_id,replace(o.product_key,'gap-bundle-','gap-'),null)
  on conflict(user_id,product_key) do update set revoked_at=null,granted_at=now();
 else
 insert into public.product_access(user_id,product_key,revoked_at) values(o.user_id,o.product_key,null)
 on conflict(user_id,product_key) do update set revoked_at=null,granted_at=now();
 end if;
 update public.teach_orders set state='paid',paid_at=now(),checkout_session_id=p_session,checkout_url=null where id=p_order;
 return true;
end $$;
revoke all on function public.fulfill_teach_order(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.fulfill_teach_order(uuid,text,text,integer,text) to service_role;



commit;
