'use client';
import CheckoutButton from '../../../components/CheckoutButton';
import {useEffect,useState} from 'react';
import {getSupabase} from '../../../lib/supabase-browser';
import {gapPrice,gapQuote} from '../../../lib/gap-catalog.mjs';
import {authPath} from '../../../lib/auth-return.mjs';
import s from '../../../components/account.module.css';

export default function Enrollment({productKey,title,pages}){
  const [account,setAccount]=useState({state:'loading',rows:[]});
  useEffect(()=>{let active=true;
    const sb=getSupabase();
    async function load(){
      try{
        const {data:auth,error:authError}=await sb.auth.getUser();
        // No saved session is normal for a visitor. Other auth failures need a retry.
        if(authError&&authError.name!=='AuthSessionMissingError')throw authError;
        if(!auth.user){if(active)setAccount({state:'visitor',rows:[]});return;}
        const {data,error}=await sb.from('product_access').select('product_key,revoked_at').eq('user_id',auth.user.id);
        if(error)throw error;
        if(active)setAccount({state:'signed-in',rows:data||[]});
      }catch{if(active)setAccount({state:'error',rows:[]});}
    }
    load();
    return()=>{active=false;};
  },[productKey]);
  const quote=gapQuote(productKey,account.rows);
  return <section className={s.panel}>
    <h2>{title}</h2><p>{pages}-page PDF download · One-time purchase</p>
    {account.state==='loading'?<p role="status">Checking your family’s GAP packages…</p>:account.state==='error'?<p role="alert">We couldn’t check your family’s purchases. Refresh to try again before confirming your price.</p>:quote.owned?<>
      <p>This package is already included in your account.</p><div className={s.actions}><a href="/resources">Download your GAP curriculum →</a></div>
    </>:<>
      <p><strong>{gapPrice(quote.priceCents)}</strong>{quote.discountCents?' · Your $10 additional-package discount is included.':' · First GAP package'}</p>
      <p>Your first GAP package is $59.99. Every additional grade-band package is $49.99, whether you purchase it now or return later using the same family account.</p>
      {account.state==='visitor'&&<p>Already own GAP? <a href={authPath('login',`/curriculum/gap/enroll?product=${productKey}`)}>Sign in to check your additional-package price →</a></p>}
      <CheckoutButton productKey={productKey}/>
      <p><a href="/contact">Contact TEACH for enrollment help →</a></p>
    </>}
    <div className={s.links}><a href="/curriculum/gap#choose">Compare grade bands</a><a href="/resources">Your purchased resources</a></div>
  </section>;
}
