'use client';

import {useState} from 'react';
import {getSupabase} from '../../lib/supabase-browser';
import {gapProduct} from '../../lib/gap-catalog.mjs';
import s from '../../components/account.module.css';

export default function GapDownload({productKey}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const product=gapProduct(productKey);
 if(!product)return null;

 async function download(){
  setBusy(true);
  setError('');
  try{
   const sb=getSupabase();
   const material=await sb.from('teach_materials').select('storage_path')
    .eq('product_key',productKey).eq('published',true).eq('kind','document').single();
   if(material.error)throw material.error;
   const result=await sb.storage.from('teach-resources').createSignedUrl(material.data.storage_path,300,{
    download:`GAP-Curriculum-Grades-${product.id}.pdf`,
   });
   if(result.error||!result.data?.signedUrl)throw result.error||new Error('Download unavailable');
   window.location.assign(result.data.signedUrl);
  }catch{
   setError('We couldn’t start your download. Tap the download button to try again, or contact TEACH for help.');
  }finally{setBusy(false);}
 }

 return <div>
  <button className={s.button} type="button" disabled={busy} onClick={download}>
   {busy?'Starting download…':`Download GAP Curriculum · Grades ${product.grades} (PDF)`}
  </button>
  <p className={s.hint}>If the PDF opens on your iPhone or iPad, tap Share, then Save to Files to keep a copy.</p>
  {error&&<p role="alert">{error} <a href="/contact">Contact TEACH</a></p>}
 </div>;
}
