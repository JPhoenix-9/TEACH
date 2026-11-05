-- Requires existing TEACH commerce and Transcript Architect entitlements.
-- One paid order creates one independent student license; replay cannot duplicate it.
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
 else
 insert into public.product_access(user_id,product_key,revoked_at) values(o.user_id,o.product_key,null)
 on conflict(user_id,product_key) do update set revoked_at=null,granted_at=now();
 end if;
 update public.teach_orders set state='paid',paid_at=now(),checkout_session_id=p_session,checkout_url=null where id=p_order;
 return true;
end $$;
revoke all on function public.fulfill_teach_order(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.fulfill_teach_order(uuid,text,text,integer,text) to service_role;


insert into public.teach_price_catalog(product_key,product_id,price_id,amount,additional_price_id) values('transcript-architect','prod_VZiEwCWAedNQK2','price_1UYYo8EH2BoIIOEOP96hqvJK',7900,null);
