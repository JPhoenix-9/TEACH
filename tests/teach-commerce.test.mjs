import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import Stripe from 'stripe';
import {createHandler,verifyPaidOrder} from '../supabase/functions/teach-commerce/handler.mjs';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';

test('server order transactions preserve discount, reject duplicate ownership and isolate family data',async()=>{
 const db=new PGlite();try{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create schema private;create schema vault;
   create table vault.decrypted_secrets(name text,decrypted_secret text);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,public to authenticated,service_role;
   create table family_profiles(user_id uuid primary key,parent_name text);
   create table product_access(user_id uuid references family_profiles,product_key text,granted_at timestamptz default now(),revoked_at timestamptz,primary key(user_id,product_key));
   insert into family_profiles values('${A}','Family A'),('${B}','Family B');
   grant select on family_profiles to service_role;
  `);
  await db.exec(readFileSync(new URL('../supabase/teach-commerce.sql',import.meta.url),'utf8'));
  await db.exec('set role service_role');
  const reserve=async(user,key)=>(await db.query('select * from public.reserve_teach_order($1,$2,$3)',[user,key,'https://teachforlove.com'])).rows[0];
  const first=await reserve(A,'gap-k2');assert.equal(first.amount,5999);
  assert.equal((await reserve(A,'gap-k2')).id,first.id,'repeat click reuses reserved order');
  await assert.rejects(reserve(A,'gap-35'),/finish_pending_gap_order/);
  await assert.rejects(db.query('select public.fulfill_teach_order($1,$2,$3,$4,$5)',[first.id,'cs_fixture','wrong_price',5999,'evt_wrong']),/order_mismatch/);
  const fulfill=()=>db.query('select public.fulfill_teach_order($1,$2,$3,$4,$5)',[first.id,'cs_fixture',first.price_id,5999,'evt_fixture']);
  await fulfill();await fulfill();
  assert.equal((await db.query('select count(*)::int n from product_access')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int n from teach_payment_events')).rows[0].n,1,'webhook replay is idempotent');
  await assert.rejects(reserve(A,'gap-k2'),/already_owned/);
  const second=await reserve(A,'gap-35');assert.equal(second.amount,4999);
  assert(second.price_id!==first.price_id);
  const other=await reserve(B,'gap-68');assert.equal(other.amount,5999,'another family does not inherit discount');
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${A}',false);`);
  assert.equal((await db.query('select count(*)::int n from teach_orders')).rows[0].n,2);
  for(const query of ["select * from teach_price_catalog","select public.teach_billing_configuration()",`select public.reserve_teach_order('${A}','blueprint','https://teachforlove.com')`,`select public.fulfill_teach_order('${first.id}','cs_fixture','${first.price_id}',5999,'evt_forged')`])await assert.rejects(db.exec(query),/permission denied/);
 }finally{await db.close();}
});

const order={id:'11111111-1111-4111-8111-111111111111',user_id:A,product_key:'gap-k2',price_id:'price_fixture',amount:5999,currency:'usd',checkout_session_id:'cs_fixture'};
const session={id:'cs_fixture',livemode:true,mode:'payment',status:'complete',payment_status:'paid',client_reference_id:order.id,metadata:{teach_order_id:order.id,teach_user_id:A,teach_product_key:'gap-k2'},currency:'usd',amount_subtotal:5999};
const items=[{quantity:1,price:{id:'price_fixture'}}];
test('fulfillment requires exact paid session, identity, price, amount and quantity',()=>{
 assert.equal(verifyPaidOrder(session,items,order),true);
 for(const patch of [{livemode:false},{payment_status:'unpaid'},{status:'open'},{amount_subtotal:4999},{currency:'eur'},{client_reference_id:B},{metadata:{...session.metadata,teach_user_id:B}}])assert.equal(verifyPaidOrder({...session,...patch},items,order),false);
 assert.equal(verifyPaidOrder(session,[{quantity:2,price:{id:'price_fixture'}}],order),false);
 assert.equal(verifyPaidOrder(session,[{quantity:1,price:{id:'different'}}],order),false);
});
test('real Stripe signatures gate webhook fulfillment; unpaid or malformed requests never grant access',async()=>{
 const signing='whsec_fixture_only',sdk=new Stripe('sk_test_fixture_only');let grants=0;
 const admin={rpc:async(name)=>name==='teach_billing_configuration'?{data:{teach_stripe_secret_key:'sk_test_fixture_only',teach_stripe_webhook_secret:signing}}:(grants++,{data:true}),from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:order})})})})};
 let current=session;
 class MockStripe {constructor(){return {webhooks:sdk.webhooks,checkout:{sessions:{retrieve:async()=>current,listLineItems:async()=>({data:items})}}};}static createFetchHttpClient=Stripe.createFetchHttpClient;static createSubtleCryptoProvider=Stripe.createSubtleCryptoProvider;}
 const handle=createHandler({admin,Stripe:MockStripe,env:()=>undefined});
 async function send(valid=true){const payload=JSON.stringify({id:'evt_fixture',type:'checkout.session.completed',livemode:true,data:{object:{id:'cs_fixture'}}});const header=sdk.webhooks.generateTestHeaderString({payload,secret:signing});return handle(new Request('https://example.invalid/teach-commerce/webhook',{method:'POST',headers:{'stripe-signature':valid?header:'invalid'},body:payload}));}
 assert.equal((await send(false)).status,400);assert.equal(grants,0);
 current={...session,payment_status:'unpaid'};assert.equal((await send()).status,200);assert.equal(grants,0);
 current=session;assert.equal((await send()).status,200);assert.equal(grants,1);
 const unauth=await handle(new Request('https://example.invalid/teach-commerce/checkout',{method:'POST',headers:{origin:'https://teachforlove.com'},body:'{}'}));assert.equal(unauth.status,401);
 const hostile=await handle(new Request('https://example.invalid/teach-commerce/checkout',{method:'POST',headers:{origin:'https://evil.invalid'},body:'{}'}));assert.equal(hostile.status,403);
});
test('cancelling an unfinished GAP checkout is scoped to the authenticated family',async()=>{
 const filters=[],expired=[];let updated=false;
 const query={eq(k,v){filters.push([k,v]);return this;},like(){return this;},limit(){return this;},maybeSingle:async()=>({data:{...order,state:'reserved'}})};
 const admin={auth:{getUser:async()=>({data:{user:{id:A,email_confirmed_at:'2026-11-01'}}})},rpc:async()=>({data:{teach_stripe_secret_key:'fixture',teach_stripe_webhook_secret:'fixture'}}),from:()=>({select:()=>query,update:()=>({eq(){return this;},then(resolve){updated=true;resolve({error:null});}})})};
 class MockStripe{constructor(){return {accounts:{retrieve:async()=>({id:'acct_1UTS0sEH2BoIIOEO',charges_enabled:true})},checkout:{sessions:{retrieve:async()=>({id:'cs_fixture',status:'open'}),expire:async id=>expired.push(id)}}};}static createFetchHttpClient=Stripe.createFetchHttpClient;}
 const handle=createHandler({admin,Stripe:MockStripe,env:()=>undefined});
 const response=await handle(new Request('https://example.invalid/teach-commerce/cancel',{method:'POST',headers:{origin:'https://teachforlove.com',authorization:'Bearer fixture'},body:JSON.stringify({user_id:B})}));
 assert.equal(response.status,200);assert(filters.some(([key,value])=>key==='user_id'&&value===A));assert.deepEqual(expired,['cs_fixture']);assert.equal(updated,true);
});
