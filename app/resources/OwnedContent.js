'use client';

import {useEffect,useState} from 'react';
import {getSupabase} from '../lib/supabase-browser';
import {authPath} from '../lib/auth-return.mjs';
import {GAP_PACKAGES} from '../lib/gap-catalog.mjs';
import GapDownload from '../curriculum/gap/GapDownload';
import BlueprintCourse from './BlueprintCourse';
import Material from './Material';
import s from '../components/account.module.css';

const sections={
 blueprint:{path:'/blueprint/lessons',name:'Blueprint lessons',browse:'/blueprint'},
 gap:{path:'/curriculum/gap/downloads',name:'GAP downloads',browse:'/curriculum/gap'},
 webinars:{path:'/webinars/registered',name:'registered webinars',browse:'/webinars'},
};

export default function OwnedContent({section}){
 const {path,name,browse}=sections[section];
 const [data,setData]=useState(null),[error,setError]=useState(false);

 useEffect(()=>{
  let active=true;
  async function load(){
   try{
    const sb=getSupabase();
    const auth=await sb.auth.getUser();
    if(!active)return;
    if(!auth.data.user){window.location.replace(authPath('login',path));return;}
    const userId=auth.data.user.id;
    if(section==='blueprint'){
     const [lessons,materials]=await Promise.all([
      sb.from('teach_blueprint_lessons').select('source_step_id,source_section_id,module_key,module_title,module_position,title,position,video_url,poster_url').eq('published',true).order('module_position').order('position'),
      sb.from('teach_materials').select('id,title,storage_path,kind').eq('published',true).like('product_key','blueprint%').order('position'),
     ]);
     if(lessons.error||materials.error)throw new Error('Could not load Blueprint');
     if(active)setData({lessons:lessons.data,materials:materials.data});
     return;
    }
    const result=section==='gap'
     ?await sb.from('product_access').select('product_key').eq('user_id',userId).is('revoked_at',null).in('product_key',GAP_PACKAGES.map(item=>item.key))
     :await sb.from('webinar_registrations').select('webinar_slug').eq('user_id',userId);
    if(result.error)throw result.error;
    if(active)setData(result.data);
   }catch{if(active)setError(true);}
  }
  load();
  return()=>{active=false;};
 },[section,path]);

 return <section className={s.recordsPanel}>
  {error?<p role="alert">We couldn’t load your {name}. Refresh or <a href="/contact">contact TEACH</a>.</p>:!data?
   <p role="status">Opening your {name}…</p>:<>
   {section==='blueprint'&&<>
    {data.lessons.length>0&&<BlueprintCourse lessons={data.lessons}/>}
    {data.materials.map(material=><Material key={material.id} material={material}/>)}
    {!data.lessons.length&&!data.materials.length&&<p>No Blueprint lessons are available on this account. <a href="/contact">Get help with an earlier purchase</a>.</p>}
   </>}
   {section==='gap'&&<>
    {GAP_PACKAGES.filter(item=>data.some(row=>row.product_key===item.key)).map(item=><article className={s.material} key={item.key}><GapDownload productKey={item.key}/></article>)}
    {!data.length&&<p>No GAP packages are available on this account yet.</p>}
   </>}
   {section==='webinars'&&<>
    {data.map(row=><p key={row.webinar_slug}><a href={`/webinars/watch?webinar=${row.webinar_slug}`}>{row.webinar_slug==='5-shifts'?'Watch 5 Shifts to Stress-Free Homeschooling':'Watch Can I Really Homeschool?'}</a></p>)}
    {!data.length&&<p>You haven’t registered for a webinar yet.</p>}
   </>}
  </>}
  <div className={s.links}><a href="/my-desk">Back to My Desk</a><a href={browse}>Explore {name}</a></div>
 </section>;
}
