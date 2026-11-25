'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import {authPath} from '../lib/auth-return.mjs';
import {gapProduct} from '../lib/gap-catalog.mjs';
import {isBlueprintProduct} from '../lib/blueprint-catalog.mjs';
import GapDownload from '../curriculum/gap/GapDownload';
import s from '../components/account.module.css';

export default function PurchaseComplete(){
 const [state,setState]=useState('checking'),[product,setProduct]=useState(''),[orderId,setOrderId]=useState('');
 useEffect(()=>{
  let active=true,timer,attempts=0;
  const order=new URLSearchParams(window.location.search).get('order');
  if(!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(order||'')){setState('missing');return;}
  setOrderId(order);
  async function check(){
   try{
    const sb=getSupabase(),auth=await sb.auth.getUser();
    if(!auth.data.user){if(active)setState('signin');return;}
    const {data,error}=await sb.from('teach_orders').select('state,product_key').eq('id',order).eq('user_id',auth.data.user.id).maybeSingle();
    if(error)throw error;
    if(!active)return;
    if(!data){setState('missing');return;}
    if(data.state==='paid'){setProduct(data.product_key);setState('paid');return;}
    if(data.state==='failed'||data.state==='expired'){setState('unpaid');return;}
    if(++attempts===20)setState('pending');
    timer=setTimeout(check,attempts>=20?15000:3000);
   }catch{if(active)setState('error');}
  }
  check();
  return()=>{active=false;clearTimeout(timer);};
 },[]);
 const messages={
  checking:'Waiting for Stripe to confirm your payment. Your download or lesson link will appear here as soon as it’s confirmed.',
  paid:'Payment confirmed.',
  pending:'Stripe hasn’t confirmed your payment yet. You don’t need to buy again. Your download or lesson link will appear here and in My Desk when payment is confirmed.',
  unpaid:'This checkout expired or the payment was unsuccessful. Check your Stripe receipt before starting another order.',
  missing:'We couldn’t find an order for this account. Check My Desk or contact TEACH.',
  signin:'Sign in to the family account you used to purchase.',
  error:'We couldn’t check this order. Refresh or contact TEACH with your Stripe receipt.',
 };
 const bundle=product.startsWith('gap-bundle-');
 const gap=gapProduct(bundle?product.replace('gap-bundle-','gap-'):product);
 return <section className={s.panel}>
  <p role="status">{messages[state]}</p>
  {state==='paid'&&gap&&<GapDownload productKey={gap.key}/>}
  {state==='paid'&&(bundle||isBlueprintProduct(product))&&<p><a className={s.button} href="/blueprint/lessons">Open Blueprint Lessons</a></p>}
  {state==='paid'&&product==='transcript-architect'&&<p><a className={s.button} href="/generators/transcript">Open Transcript Architect</a></p>}
  {state==='signin'&&<p><a className={s.button} href={authPath('login',`/purchase-complete?order=${orderId}`)}>Sign in to see your purchase</a></p>}
  <div className={s.links}><a href="/my-desk">My Desk</a><a href="/contact">Contact TEACH</a></div>
 </section>;
}
