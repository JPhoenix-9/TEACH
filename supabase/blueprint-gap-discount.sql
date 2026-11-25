-- Apply first in the TEACH test database. A complete Blueprint qualifies; its individual modules do not.
create or replace function public.reserve_teach_order(p_user uuid,p_key text,p_origin text) returns public.teach_orders language plpgsql security invoker set search_path='' as $$
declare c public.teach_price_catalog; o public.teach_orders; discounted boolean;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_user::text,0));
 if not exists(select 1 from public.family_profiles where user_id=p_user and length(trim(parent_name))>0) then raise exception 'profile_required'; end if;
 select * into c from public.teach_price_catalog where product_key=p_key;
 if not found then raise exception 'unknown_product'; end if;
 if exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and (product_key=p_key or (p_key like 'blueprint-module-%' and product_key='blueprint'))) then raise exception 'already_owned'; end if;
 update public.teach_orders set state='expired' where user_id=p_user and state='reserved' and expires_at<=now();
 select * into o from public.teach_orders where user_id=p_user and product_key=p_key and state='reserved' order by created_at desc limit 1;
 if found then return o; end if;
 -- Finish a pending GAP purchase before quoting another grade band.
 if p_key like 'gap-%' and exists(select 1 from public.teach_orders where user_id=p_user and product_key like 'gap-%' and state='reserved') then raise exception 'finish_pending_gap_order'; end if;
 select exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912')) into discounted;
 insert into public.teach_orders(user_id,product_key,price_id,amount,currency,return_origin)
 values(p_user,p_key,case when p_key like 'gap-%' and discounted then c.additional_price_id else c.price_id end,case when p_key like 'gap-%' and discounted then 4999 else c.amount end,c.currency,p_origin) returning * into o;
 return o;
end $$;
revoke all on function public.reserve_teach_order(uuid,text,text) from public,anon,authenticated;
grant execute on function public.reserve_teach_order(uuid,text,text) to service_role;

