'use client';
import MoneyBackGuarantee from './MoneyBackGuarantee';
import {useEffect,useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import {authPath} from '../lib/auth-return.mjs';
import s from './account.module.css';
const endpoint='https://jhooodlcvcpnzcpreqmu.supabase.co/functions/v1/teach-commerce';
export default function CheckoutButton({productKey}){
 const [state,setState]=useState('checking'),[message,setMessage]=useState(''),[signedIn,setSignedIn]=useState(false),[code,setCode]=useState('');
 useEffect(()=>{let active=true;Promise.all([fetch(endpoint+'/status').then(r=>r.json()),getSupabase().auth.getUser()]).then(([status,auth])=>{if(active){setSignedIn(!!auth.data.user);setState(status.ready?'ready':'setup');}}).catch(()=>{if(active)setState('setup');});return()=>{active=false;};},[]);
 const next=productKey.startsWith('gap-')?`/curriculum/gap/enroll?product=${productKey}`:`/blueprint/enroll?product=${productKey}`;
 async function checkout(){setState('busy');setMessage('');setCode('');try{
  const sb=getSupabase(),{data,error}=await sb.auth.getSession();
  if(error||!data.session){window.location.assign(authPath('login',next));return;}
  const response=await fetch(endpoint+'/checkout',{method:'POST',headers:{Authorization:`Bearer ${data.session.access_token}`,'Content-Type':'application/json'},body:JSON.stringify({product:productKey})});
  const result=await response.json();
  if(!response.ok){setCode(result.code||'');setMessage(result.error||'We couldn’t open checkout. Please try again.');setState('ready');return;}
  const url=new URL(result.url);if(url.protocol!=='https:'||url.hostname!=='checkout.stripe.com')throw new Error('invalid_checkout');
  window.location.assign(url.href);
 }catch{setState('ready');setMessage('We couldn’t open checkout. Please try again.');}}
 async function cancel(){setState('busy');try{const {data}=await getSupabase().auth.getSession();const r=await fetch(endpoint+'/cancel',{method:'POST',headers:{Authorization:`Bearer ${data.session?.access_token}`}});const result=await r.json();if(r.ok){setMessage('Your unfinished checkout was cancelled. You can continue with this grade band.');setCode('');}else setMessage(result.error);}catch{setMessage('We couldn’t cancel that checkout. Please try again.');}finally{setState('ready');}}
 return <div>
  <MoneyBackGuarantee/>
  {state==='checking'?<p role="status">Checking checkout availability…</p>:state==='setup'?<p role="status">Checkout is being connected. No payment has been taken.</p>:signedIn?<><button className={s.button} disabled={state==='busy'} onClick={checkout}>{state==='busy'?'Opening secure checkout…':'Continue to secure checkout →'}</button><p className={s.hint}>Review your order and pay securely with Stripe. Your purchase opens in Resources after payment is confirmed.</p></>:<div className={s.actions}><a href={authPath('login',next)}>Sign in to purchase →</a><a href={authPath('signup',next)}>Create a free family account →</a></div>}
  {code==='finish_pending_gap_order'&&<button className={`${s.button} ${s.secondary}`} disabled={state==='busy'} onClick={cancel}>Cancel unfinished GAP checkout</button>}
  {message&&<p role="alert">{message} <a href={message.includes('profile')?`/account?next=${encodeURIComponent(next)}`:'/resources'}>{message.includes('profile')?'Open family profile':'Your Resources'} →</a></p>}
 </div>;
}
