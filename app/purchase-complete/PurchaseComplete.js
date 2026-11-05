'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import s from '../components/account.module.css';
export default function PurchaseComplete(){
 const [state,setState]=useState('checking'),[transcript,setTranscript]=useState(false);
 useEffect(()=>{let active=true,timer,attempts=0;const order=new URLSearchParams(window.location.search).get('order');
  if(!/^[0-9a-f-]{36}$/i.test(order||'')){setState('missing');return;}
  async function check(){try{
   const sb=getSupabase(),auth=await sb.auth.getUser();if(!auth.data.user){if(active)setState('signin');return;}
   const {data,error}=await sb.from('teach_orders').select('state,product_key').eq('id',order).eq('user_id',auth.data.user.id).maybeSingle();
   if(error)throw error;if(!active)return;
   if(data?.state==='paid'){setTranscript(data.product_key==='transcript-architect');setState('paid');return;}
   if(data?.state==='failed'||data?.state==='expired'){setState('unpaid');return;}
   if(++attempts>=20){setState('pending');return;}timer=setTimeout(check,3000);
  }catch{if(active)setState('error');}}
  check();return()=>{active=false;clearTimeout(timer);};
 },[]);
 const messages={checking:'Waiting for Stripe to confirm your payment…',paid:'Payment confirmed. Your purchase is ready in Resources.',pending:'Your payment is still awaiting confirmation. Some payment methods take longer. You don’t need to purchase again; your resources will open when confirmation arrives.',unpaid:'This checkout has expired or the payment was unsuccessful. Check your Stripe receipt before starting another order.',missing:'No order was specified. Open Resources to see purchases attached to your account.',signin:'Please sign in to the family account used for your purchase to see its status.',error:'We couldn’t check this order. Refresh or contact TEACH with your Stripe receipt.'};
 return <section className={s.panel}><p role="status">{state==='paid'&&transcript?'Payment confirmed. Your student purchase is ready in Transcript Architect.':messages[state]}</p><div className={s.actions}><a href={transcript?"/generators/transcript":"/resources"}>{transcript?"Open Transcript Architect →":"Open your Resources →"}</a><a href="/contact">Contact TEACH</a></div></section>;
}
