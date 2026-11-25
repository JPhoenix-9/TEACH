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
