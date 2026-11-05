-- One-time purchases. Only the server role reserves or fulfills orders.
create table public.teach_price_catalog(
 product_key text primary key, product_id text not null unique,
 price_id text not null unique, amount integer not null check(amount>0),
 additional_price_id text unique, currency text not null default 'usd' check(currency='usd')
);
alter table public.teach_price_catalog enable row level security;
revoke all on public.teach_price_catalog from public,anon,authenticated;
grant select,insert,update on public.teach_price_catalog to service_role;
create table public.teach_orders(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.family_profiles(user_id),
 product_key text not null references public.teach_price_catalog(product_key), price_id text not null,
 amount integer not null check(amount>0),currency text not null check(currency='usd'),
 state text not null default 'reserved' check(state in ('reserved','paid','expired','failed')),
 return_origin text not null, checkout_session_id text unique, checkout_url text,
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '31 minutes',paid_at timestamptz
);
alter table public.teach_orders enable row level security;
revoke all on public.teach_orders from public,anon,authenticated;
grant select on public.teach_orders to authenticated;
grant select,insert,update on public.teach_orders to service_role;
create policy teach_orders_own_read on public.teach_orders for select to authenticated using(user_id=(select auth.uid()));
create index teach_orders_user_state on public.teach_orders(user_id,state);
create table public.teach_payment_events(event_id text primary key,order_id uuid not null references public.teach_orders(id),received_at timestamptz not null default now());
alter table public.teach_payment_events enable row level security;
revoke all on public.teach_payment_events from public,anon,authenticated;
grant select,insert on public.teach_payment_events to service_role;
grant select,insert,update on public.product_access to service_role;

create function public.reserve_teach_order(p_user uuid,p_key text,p_origin text) returns public.teach_orders language plpgsql security invoker set search_path='' as $$
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
 select exists(select 1 from public.product_access where user_id=p_user and revoked_at is null and product_key in ('gap-k2','gap-35','gap-68','gap-912')) into discounted;
 insert into public.teach_orders(user_id,product_key,price_id,amount,currency,return_origin)
 values(p_user,p_key,case when p_key like 'gap-%' and discounted then c.additional_price_id else c.price_id end,case when p_key like 'gap-%' and discounted then 4999 else c.amount end,c.currency,p_origin) returning * into o;
 return o;
end $$;
revoke all on function public.reserve_teach_order(uuid,text,text) from public,anon,authenticated;
grant execute on function public.reserve_teach_order(uuid,text,text) to service_role;

create function public.fulfill_teach_order(p_order uuid,p_session text,p_price text,p_amount integer,p_event text) returns boolean language plpgsql security invoker set search_path='' as $$
declare o public.teach_orders;
begin
 select * into o from public.teach_orders where id=p_order for update;
 if not found or o.price_id<>p_price or o.amount<>p_amount or (o.checkout_session_id is not null and o.checkout_session_id<>p_session) then raise exception 'order_mismatch'; end if;
 if o.state='paid' then return true; end if;
 insert into public.teach_payment_events(event_id,order_id) values(p_event,p_order) on conflict do nothing;
 if not found then return false; end if;
 insert into public.product_access(user_id,product_key,revoked_at) values(o.user_id,o.product_key,null)
 on conflict(user_id,product_key) do update set revoked_at=null,granted_at=now();
 update public.teach_orders set state='paid',paid_at=now(),checkout_session_id=p_session,checkout_url=null where id=p_order;
 return true;
end $$;
revoke all on function public.fulfill_teach_order(uuid,text,text,integer,text) from public,anon,authenticated;
grant execute on function public.fulfill_teach_order(uuid,text,text,integer,text) to service_role;

-- Fixed Vault names; never expose a configurable secret lookup to clients.
create function private.teach_billing_secrets() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_object_agg(name,decrypted_secret),'{}'::jsonb) from vault.decrypted_secrets where name in ('teach_stripe_secret_key','teach_stripe_webhook_secret')
$$;
revoke all on function private.teach_billing_secrets() from public,anon,authenticated;
grant usage on schema private to service_role;
grant execute on function private.teach_billing_secrets() to service_role;
create function public.teach_billing_configuration() returns jsonb language sql stable security invoker set search_path='' as $$select private.teach_billing_secrets()$$;
revoke all on function public.teach_billing_configuration() from public,anon,authenticated;
grant execute on function public.teach_billing_configuration() to service_role;

insert into public.teach_price_catalog(product_key,product_id,price_id,amount,additional_price_id) values
('blueprint','teach_blueprint','price_1UYGWOEH2BoIIOEOqrFyEzvZ',14999,null),
('blueprint-module-1','teach_blueprint_module_1','price_1UYGWREH2BoIIOEOZbQGGevo',2999,null),
('blueprint-module-2','teach_blueprint_module_2','price_1UYGWYEH2BoIIOEOZqU81lHM',2999,null),
('blueprint-module-3','teach_blueprint_module_3','price_1UYGWbEH2BoIIOEOLzJeMQju',2999,null),
('blueprint-module-4','teach_blueprint_module_4','price_1UYGWeEH2BoIIOEOu0llf37j',2999,null),
('blueprint-module-5','teach_blueprint_module_5','price_1UYGWiEH2BoIIOEOMcYx5GCg',2999,null),
('blueprint-module-6','teach_blueprint_module_6','price_1UYGWmEH2BoIIOEOWcTTSPMk',2999,null),
('gap-k2','teach_gap_k2','price_1UYGWpEH2BoIIOEOoR7oe8In',5999,'price_1UYGaWEH2BoIIOEOnDLavC1b'),
('gap-35','teach_gap_35','price_1UYGWvEH2BoIIOEOWVymG01Z',5999,'price_1UYGaZEH2BoIIOEOp0GkKaA6'),
('gap-68','teach_gap_68','price_1UYGWzEH2BoIIOEOPACGiQ8v',5999,'price_1UYGadEH2BoIIOEOccdx3zda'),
('gap-912','teach_gap_912','price_1UYGX7EH2BoIIOEOMgohDZVy',5999,'price_1UYGagEH2BoIIOEOs2Xt5UxE');
