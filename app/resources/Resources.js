'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import {blueprintProduct,isBlueprintProduct} from '../lib/blueprint-catalog.mjs';
import {authPath} from '../lib/auth-return.mjs';
import Material from './Material';
import BlueprintCourse from './BlueprintCourse';
import s from '../components/account.module.css';
const products={'gap-k2':'GAP · Kindergarten–Grade 2','gap-35':'GAP · Grades 3–5','gap-68':'GAP · Grades 6–8','gap-912':'GAP · Grades 9–12'};

export default function Resources(){
 const [data,setData]=useState(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;(async()=>{
   const sb=getSupabase(),auth=await sb.auth.getUser();
   if(!auth.data.user){window.location.replace(authPath('login','/resources'));return;}
   const [access,materials,registrations,blueprint]=await Promise.all([
     sb.from('product_access').select('product_key,revoked_at').eq('user_id',auth.data.user.id),
     sb.from('teach_materials').select('id,title,storage_path,kind,product_key,webinar_slug').eq('published',true).order('position'),
     sb.from('webinar_registrations').select('webinar_slug').eq('user_id',auth.data.user.id),
     // The database returns only this user's purchased modules (or all for staff).
     sb.from('teach_blueprint_lessons').select('source_step_id,source_section_id,module_key,module_title,module_position,title,position,video_url,poster_url').eq('published',true).order('module_position').order('position')
   ]);
   for(const result of [access,materials,registrations])if(result.error)throw result.error;
   if(active)setData({products:access.data.filter(row=>!row.revoked_at).map(row=>row.product_key),materials:materials.data,registrations:registrations.data,blueprint:blueprint.data||[],blueprintError:!!blueprint.error});
 })().catch(()=>{if(active)setError('We couldn’t load your resources. Refresh to try again.');});return()=>{active=false;};},[]);
 const blueprintKeys=data?.products.filter(isBlueprintProduct)||[];
 return <div className={s.recordsPanel}>
   <div className={s.links}><a href="/my-desk">← My Desk</a><a href="/account">Family account</a></div>
   {error?<p role="alert">{error}</p>:!data?<p role="status">Opening your resources…</p>:<>
     {!data.products.length&&!data.blueprint.length&&<><h2>Choose your next step.</h2><p>Your purchased resources will appear here. If an earlier Homeschool-911 purchase is not recognized, <a href="/contact">ask TEACH for access help</a>.</p><div className={s.actions}><a href="/blueprint">Explore Blueprint →</a><a href="/curriculum/gap">Explore GAP →</a></div></>}
     {data.blueprint.length>0&&<BlueprintCourse lessons={data.blueprint}/>}
     {data.blueprintError&&<p role="alert">We couldn’t load the Blueprint lessons. Refresh to try again.</p>}
     {blueprintKeys.length>0&&!data.blueprint.length&&!data.blueprintError&&<section><h2>Your Blueprint</h2><p>Your account includes {blueprintKeys.map(key=>blueprintProduct(key).title).join(', ')}. The lessons could not be found; please <a href="/contact">contact TEACH for access help</a>.</p></section>}
     {data.products.filter(key=>!isBlueprintProduct(key)).map(key=><section key={key}>
       <h2>{products[key]||'Your purchased resource'}</h2>
       {data.materials.filter(material=>material.product_key===key).length?data.materials.filter(material=>material.product_key===key).map(material=><Material material={material} key={material.id}/>):<p>Your purchase is recognized. The course or download files are being prepared for this new site. Continue using your original purchase access while they are moved.</p>}
     </section>)}
     {data.materials.filter(material=>isBlueprintProduct(material.product_key)).map(material=><Material material={material} key={material.id}/>)}
     <h2>Your registered webinars</h2>
     {data.registrations.length?data.registrations.map(registration=><p key={registration.webinar_slug}><a href={`/webinars/watch?webinar=${registration.webinar_slug}`}>{registration.webinar_slug==='5-shifts'?'5 Shifts to Stress-Free Homeschooling':'Can I Really Homeschool?'} →</a></p>):<p><a href="/webinars">Explore the free webinars →</a></p>}
   </>}
 </div>;
}
