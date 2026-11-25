import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createHandler, verifyPaidOrder} from '../supabase/functions/teach-commerce/handler.mjs';

test('a Stripe test payment can only verify against test checkout', () => {
  const order = {id:'order', user_id:'family', product_key:'blueprint', amount:14900, currency:'usd', price_id:'price'};
  const session = {livemode:false, mode:'payment', status:'complete', payment_status:'paid',
    client_reference_id:order.id, metadata:{teach_order_id:order.id,teach_user_id:order.user_id,teach_product_key:order.product_key},
    currency:order.currency,amount_subtotal:order.amount};
  const items = [{quantity:1,price:{id:order.price_id}}];
  assert.equal(verifyPaidOrder(session,items,order,false), true);
  assert.equal(verifyPaidOrder(session,items,order), false);
  assert.equal(verifyPaidOrder({...session,livemode:true},items,order,false), false);
});

test('sandbox checkout rejects production origins and live credentials', async () => {
  const origin = 'https://teach-test.example';
  const handler = createHandler({sandbox:{origin,accountId:'acct_test'},env:()=> 'sk_live_fixture'});
  const request = from => new Request('https://example.invalid/teach-commerce-sandbox/status',{headers:{origin:from}});
  assert.equal((await handler(request('https://teachforlove.com'))).status, 403);
  assert.deepEqual(await (await handler(request(origin))).json(), {ready:false});
});

test('private live fulfillment is limited to the designated family and the exact saved $0 checkout',()=>{
 const order={id:'o1',user_id:'owner-test',product_key:'gap-bundle-k2',amount:19899,currency:'usd',price_id:'p1',checkout_session_id:'cs_1'};
 const session={id:'cs_1',livemode:true,mode:'payment',status:'complete',payment_status:'no_payment_required',
  client_reference_id:order.id,currency:'usd',amount_subtotal:19899,amount_total:0,total_details:{amount_discount:19899,amount_tax:0},
  metadata:{teach_order_id:order.id,teach_user_id:order.user_id,teach_product_key:order.product_key,teach_private_coupon:'teach_private_blueprint_gap_fulfillment_test'}};
 const items=[{quantity:1,price:{id:'p1'}}];
 assert.equal(verifyPaidOrder(session,items,order,true,order.user_id),true);
 assert.equal(verifyPaidOrder(session,items,order,true,'different-user'),false);
 assert.equal(verifyPaidOrder(session,items,order,true),false);
 assert.equal(verifyPaidOrder({...session,amount_total:1},items,order,true,order.user_id),false);
 assert.equal(verifyPaidOrder({...session,metadata:{...session.metadata,teach_private_coupon:'other'}},items,order,true,order.user_id),false);
 assert.equal(verifyPaidOrder(session,items,{...order,checkout_session_id:null},true,order.user_id),false);
});
