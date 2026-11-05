'use client';
import CheckoutButton from '../../components/CheckoutButton';
import {useEffect,useState} from 'react';
import {getSupabase} from '../../lib/supabase-browser';
import {authPath} from '../../lib/auth-return.mjs';
import {hasBlueprintProduct} from '../../lib/blueprint-catalog.mjs';
import s from '../../components/account.module.css';

export default function Enrollment({productKey,title,price,videos}){
  const [account,setAccount]=useState({state:'loading',owned:false});
  useEffect(()=>{let active=true;(async()=>{
    const sb=getSupabase(),{data:auth,error:authError}=await sb.auth.getUser();
    if(authError&&authError.name!=='AuthSessionMissingError')throw authError;
    if(!auth.user){if(active)setAccount({state:'visitor',owned:false});return;}
    const {data,error}=await sb.from('product_access').select('product_key').eq('user_id',auth.user.id).is('revoked_at',null);
    if(error)throw error;
    if(active)setAccount({state:'signed-in',owned:hasBlueprintProduct((data||[]).map(row=>row.product_key),productKey)});
  })().catch(()=>{if(active)setAccount({state:'error',owned:false});});return()=>{active=false;};},[productKey]);
  return <section className={s.panel}>
    <h2>{title}</h2><p><strong>{price}</strong> · One-time purchase · {videos} videos</p>
    <p>{productKey==='blueprint'?'Includes all six modules of the Homeschool Success Blueprint.':'Includes the selected module. The other five modules are available separately or in the complete package.'}</p>
    {account.state==='loading'?<p role="status">Checking your Blueprint access…</p>:account.state==='error'?<p role="alert">We couldn’t check your course access. Refresh to try again.</p>:account.owned?<><p>This selection is already included in your account.</p><div className={s.actions}><a href="/resources">Open your Blueprint lessons →</a></div></>:<>
      {account.state==='visitor'&&<p>Already own Blueprint? <a href={authPath('login',`/blueprint/enroll?product=${productKey}`)}>Sign in to check your access →</a></p>}
      <CheckoutButton productKey={productKey}/>
      <p><a href="/contact">Contact TEACH for enrollment help →</a></p>
    </>}
    <div className={s.links}><a href="/blueprint#enroll">Compare the complete course and individual modules</a><a href="/resources">Your purchased resources</a></div>
  </section>;
}
