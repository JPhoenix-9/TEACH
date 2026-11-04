'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '../../lib/supabase-browser';
import {hasBlueprintProduct} from '../../lib/blueprint-catalog.mjs';
import s from '../../components/account.module.css';

export default function Enrollment({productKey,title,price,videos}){
  const [owned,setOwned]=useState(false);
  useEffect(()=>{let active=true;(async()=>{
    const sb=getSupabase(),{data:auth}=await sb.auth.getUser();
    if(!auth.user)return;
    const {data,error}=await sb.from('product_access').select('product_key').eq('user_id',auth.user.id).is('revoked_at',null);
    if(active&&!error)setOwned(hasBlueprintProduct((data||[]).map(row=>row.product_key),productKey));
  })().catch(()=>{});return()=>{active=false;};},[productKey]);
  return <section className={s.panel}>
    <h2>{title}</h2><p><strong>{price}</strong> · One-time purchase · {videos} videos</p>
    <p>{productKey==='blueprint'?'Includes all six modules of the Homeschool Success Blueprint.':'Includes the selected module. The other five modules are available separately or in the complete package.'}</p>
    {owned?<><p>This selection is already included in your account.</p><div className={s.actions}><a href="/resources">Open your Blueprint lessons →</a></div></>:<>
      <p role="status">Online enrollment is not open yet. Your selection is shown above; no payment has been taken.</p>
      <p><a href="/contact">Contact TEACH for enrollment help →</a></p>
    </>}
    <div className={s.links}><a href="/blueprint#enroll">Compare the complete course and individual modules</a><a href="/resources">Your purchased resources</a></div>
  </section>;
}
