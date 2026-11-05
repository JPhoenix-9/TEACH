export const ACCOUNT_ID='acct_1UTS0sEH2BoIIOEO';
const origins=new Set(['https://teachforlove.com','https://www.teachforlove.com','https://teach-mocha.vercel.app']);
export function verifyPaidOrder(session,items,order){
 return session.livemode===true&&session.mode==='payment'&&session.status==='complete'&&session.payment_status==='paid'
  &&session.client_reference_id===order.id&&session.metadata?.teach_order_id===order.id
  &&session.metadata?.teach_user_id===order.user_id&&session.metadata?.teach_product_key===order.product_key
  &&session.currency===order.currency&&session.amount_subtotal===order.amount
  &&(!order.checkout_session_id||session.id===order.checkout_session_id)
  &&items.length===1&&items[0].quantity===1&&items[0].price?.id===order.price_id;
}
export function createHandler({admin,Stripe,env}){
 return async request=>{
  const origin=request.headers.get('origin');
  const cors=origins.has(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Vary':'Origin'}:{};
  const json=(body,status=200)=>Response.json(body,{status,headers:{...cors,'Cache-Control':'no-store'}});
  const action=new URL(request.url).pathname.split('/').pop();
  if(request.method==='OPTIONS')return new Response(null,{status:origins.has(origin)?204:403,headers:cors});
  if(origin&&!origins.has(origin))return json({error:'This website is not connected to checkout.'},403);
  try{
   if(!['status','checkout','cancel','webhook'].includes(action))return json({error:'Not found'},404);
   if(['checkout','cancel'].includes(action)&&request.method!=='POST'||action==='webhook'&&request.method!=='POST'||action==='status'&&request.method!=='GET')return json({error:'Method not allowed'},405);
   let user;
   if(['checkout','cancel'].includes(action)){
    if(!origins.has(origin))return json({error:'Open checkout from TEACH.'},403);
    const token=request.headers.get('authorization')?.replace(/^Bearer\s+/i,'');
    if(!token)return json({error:'Please sign in before purchasing.'},401);
    const auth=await admin.auth.getUser(token);
    if(auth.error||!auth.data.user?.email_confirmed_at)return json({error:'Sign in with a confirmed email before purchasing.'},401);
    user=auth.data.user;
   }
   const config=await admin.rpc('teach_billing_configuration');
   if(config.error)throw new Error('configuration_unavailable');
   const key=env('STRIPE_SECRET_KEY')||config.data?.teach_stripe_secret_key;
   const signing=env('STRIPE_WEBHOOK_SECRET')||config.data?.teach_stripe_webhook_secret;
   if(!key||!signing)return action==='status'?json({ready:false}):json({error:'Checkout is being connected. No payment has been taken.'},503);
   const stripe=new Stripe(key,{apiVersion:'2026-09-30.endive',httpClient:Stripe.createFetchHttpClient(),maxNetworkRetries:2});
   if(action==='webhook'){
    let event;
    try{event=await stripe.webhooks.constructEventAsync(await request.text(),request.headers.get('stripe-signature')||'',signing,300,Stripe.createSubtleCryptoProvider());}
    catch{return json({error:'Invalid webhook signature.'},400);}
    if(event.livemode!==true||event.account&&event.account!==ACCOUNT_ID)return json({error:'Wrong Stripe account or environment.'},400);
    if(!['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','checkout.session.expired'].includes(event.type))return json({received:true});
    const session=await stripe.checkout.sessions.retrieve(event.data.object.id);
    if(session.metadata?.teach_order_id==null)return json({received:true});
    const result=await admin.from('teach_orders').select('*').eq('id',session.metadata.teach_order_id).maybeSingle();
    if(result.error||!result.data)throw new Error('order_unavailable');
    const order=result.data;
    if(['checkout.session.async_payment_failed','checkout.session.expired'].includes(event.type)){
     if(session.id===order.checkout_session_id&&session.payment_status!=='paid'){
      const changed=await admin.from('teach_orders').update({state:event.type.endsWith('expired')?'expired':'failed'}).eq('id',order.id).eq('state','reserved');
      if(changed.error)throw new Error('order_update_failed');
     }
     return json({received:true});
    }
    if(session.payment_status!=='paid')return json({received:true});
    const lineItems=await stripe.checkout.sessions.listLineItems(session.id,{limit:2});
    if(!verifyPaidOrder(session,lineItems.data,order))return json({error:'Paid order validation failed.'},400);
    const fulfilled=await admin.rpc('fulfill_teach_order',{p_order:order.id,p_session:session.id,p_price:order.price_id,p_amount:order.amount,p_event:event.id});
    if(fulfilled.error)throw new Error('fulfillment_failed');
    return json({received:true});
   }
   const account=await stripe.accounts.retrieve();
   if(account.id!==ACCOUNT_ID||!account.charges_enabled)return action==='status'?json({ready:false}):json({error:'TEACH payment setup needs attention. No payment has been taken.'},503);
   if(action==='status')return json({ready:true});
   if(action==='cancel'){
    const pending=await admin.from('teach_orders').select('*').eq('user_id',user.id).eq('state','reserved').like('product_key','gap-%').limit(1).maybeSingle();
    if(pending.error)throw new Error('pending_order_unavailable');
    if(!pending.data)return json({cancelled:true});
    if(!pending.data.checkout_session_id)return json({error:'Checkout is still being prepared. Please try again in a moment.'},409);
    const existing=await stripe.checkout.sessions.retrieve(pending.data.checkout_session_id);
    if(existing.status==='complete')return json({error:'That payment is already processing. Please wait for confirmation rather than purchasing again.'},409);
    if(existing.status==='open')await stripe.checkout.sessions.expire(existing.id);
    const updated=await admin.from('teach_orders').update({state:'expired',checkout_url:null}).eq('id',pending.data.id).eq('state','reserved');
    if(updated.error)throw new Error('cancel_order_failed');
    return json({cancelled:true});
   }
   const body=await request.json();
   if(typeof body.product!=='string'||Object.keys(body).some(k=>k!=='product'))return json({error:'Choose a valid TEACH product.'},400);
   if(body.product==='transcript-architect'&&env('TRANSCRIPT_CHECKOUT_ENABLED')!=='true')return json({error:'Transcript Architect purchases are being prepared. No payment has been taken.'},503);
   const reserved=await admin.rpc('reserve_teach_order',{p_user:user.id,p_key:body.product,p_origin:origin});
   if(reserved.error){
    const messages={profile_required:'Complete your family profile before purchasing.',already_owned:'This product is already in your Resources.',unknown_product:'Choose a valid TEACH product.',finish_pending_gap_order:'You have another unfinished GAP checkout. Return to that grade band to finish it, or wait for that checkout to expire before switching.'};
    const reason=Object.keys(messages).find(k=>reserved.error.message?.includes(k));
    return json({error:messages[reason]||'We couldn’t prepare your order. Please try again.',code:reason},409);
   }
   const order=Array.isArray(reserved.data)?reserved.data[0]:reserved.data;
   if(order.checkout_url)return json({url:order.checkout_url});
   const catalog=await admin.from('teach_price_catalog').select('*').eq('product_key',order.product_key).single();
   const price=await stripe.prices.retrieve(order.price_id,{expand:['product']});
   if(catalog.error||price.product?.id!==catalog.data.product_id||!price.product.active||!price.active||price.type!=='one_time'||price.currency!==order.currency||price.unit_amount!==order.amount)throw new Error('price_mismatch');
   const metadata={teach_order_id:order.id,teach_user_id:user.id,teach_product_key:order.product_key,teach_refund_policy:'seven_day_v1'};
   const session=await stripe.checkout.sessions.create({
    custom_text:{submit:{message:'7-day money-back guarantee: request a full refund within 7 days of purchase through TEACH Contact & Help, even after downloading or starting lessons.'}},
    mode:'payment',line_items:[{price:order.price_id,quantity:1}],client_reference_id:order.id,customer_email:user.email,
    metadata,payment_intent_data:{metadata},expires_at:Math.floor(new Date(order.expires_at).getTime()/1000),
    integration_identifier:'teach_web_'+order.id.replaceAll('-','').slice(-8).replace(/[0-9]/g,d=>String.fromCharCode(97+Number(d))),
    success_url:`${order.return_origin}/purchase-complete?order=${order.id}`,
    cancel_url:order.product_key==='transcript-architect'?`${order.return_origin}/generators/transcript`:order.product_key.startsWith('gap-')?`${order.return_origin}/curriculum/gap/enroll?product=${order.product_key}`:`${order.return_origin}/blueprint/enroll?product=${order.product_key}`
   },{idempotencyKey:'teach_order_'+order.id});
   const saved=await admin.from('teach_orders').update({checkout_session_id:session.id,checkout_url:session.url}).eq('id',order.id).eq('state','reserved');
   if(saved.error||!session.url)throw new Error('session_save_failed');
   return json({url:session.url});
  }catch(error){
   // Do not log request headers, tokens, raw webhook bodies or provider errors.
   console.error('TEACH commerce request failed:',action,error instanceof Error?error.name:'error');
   return json({error:'We couldn’t complete that request. Please try again or contact TEACH.'},500);
  }
 };
}
