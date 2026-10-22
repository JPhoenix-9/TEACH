'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {loadFamilyRecords,blankDay} from '../../lib/family-records';
import {getSupabase} from '../../lib/supabase-browser';
export default function useFamilyPlanner(enabled){
 const [data,setData]=useState(null),[records,setRecords]=useState({}),[state,setState]=useState('loading'),[errors,setErrors]=useState({}),[pending,setPending]=useState(0);
 const latest=useRef({}),revisions=useRef({}),queue=useRef(new Map()),running=useRef(false),timer=useRef(null),alive=useRef(false),errorsRef=useRef({}),active=useRef(false),identity=useRef(null);
 const status=()=>{if(alive.current){setPending(queue.current.size);setErrors({...errorsRef.current});}};
 const drain=useCallback(async()=>{
  if(running.current||!active.current)return;running.current=true;
  while(queue.current.size){const next=[...queue.current.entries()].find(([day])=>!errorsRef.current[day]);if(!next)break;const [day,generation]=next,record=latest.current[day],family=identity.current;
   try{const sb=getSupabase(),auth=await sb.auth.getUser();if(auth.error||auth.data.user?.id!==family.user.id)throw new Error('Your session has ended. Log in again to save; your entries remain here.');
    const {data:revision,error}=await sb.rpc('save_planner_day',{p_day:day,p_expected_revision:revisions.current[day]||0,p_calendar_note:record.event,p_family_note:record.familyNote,p_children:family.children.filter(c=>!c.archived_at).map(c=>({id:c.id,schooled:!!record.attendance[c.id],note:record.childNotes[c.id]||''}))});if(error)throw error;
    revisions.current[day]=Number(revision);if(queue.current.get(day)===generation)queue.current.delete(day);
   }catch(error){errorsRef.current[day]=error.message||'We couldn’t save this date. Your entries remain on this screen.';}status();
  }running.current=false;status();
 },[]);
 useEffect(()=>{if(!enabled)return;alive.current=true;loadFamilyRecords().then(result=>{if(!alive.current)return;identity.current=result;active.current=result.canEdit;revisions.current=result.revisions;latest.current=result.records;setRecords(result.records);setData(result);setState('ready');}).catch(error=>{if(!alive.current)return;if(error.signedOut){window.location.replace('/login');return;}setErrors({load:'We couldn’t open your saved Planner. Refresh to try again.'});setState('error');});
  const beforeUnload=e=>{if(queue.current.size){e.preventDefault();e.returnValue='';}},visibility=()=>{if(document.visibilityState==='hidden')drain();};window.addEventListener('beforeunload',beforeUnload);document.addEventListener('visibilitychange',visibility);
  const {data:listener}=getSupabase().auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){active.current=false;window.location.replace('/login');}});
  return()=>{alive.current=false;clearTimeout(timer.current);window.removeEventListener('beforeunload',beforeUnload);document.removeEventListener('visibilitychange',visibility);listener.subscription.unsubscribe();};
 },[enabled,drain]);
 function update(day,changes){if(!active.current)return;const subscription=identity.current?.subscription;if(!subscription||subscription.revoked_at||Date.parse(subscription.ends_at)<=Date.now()){active.current=false;setData(old=>({...old,canEdit:false}));return;}
  latest.current={...latest.current,[day]:{...blankDay(),...latest.current[day],...changes}};setRecords(latest.current);queue.current.set(day,(queue.current.get(day)||0)+1);clearTimeout(timer.current);status();timer.current=setTimeout(drain,650);
 }
 function retry(){for(const day of Object.keys(errorsRef.current))if(!errorsRef.current[day].includes('PLANNER_CONFLICT'))delete errorsRef.current[day];status();drain();}
 async function keepMine(day){try{const {data:row,error}=await getSupabase().from('planner_days').select('revision').eq('user_id',identity.current.user.id).eq('day',day).maybeSingle();if(error)throw error;revisions.current[day]=Number(row?.revision||0);delete errorsRef.current[day];status();drain();}catch{errorsRef.current[day]='We couldn’t check the saved version. Your text remains here.';status();}}
 return {data,records,state,errors,pending,update,retry,keepMine};
}
