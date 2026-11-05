'use client';
import {useEffect,useRef,useState} from 'react';
import {getSupabase} from '../../lib/supabase-browser';
import {authPath} from '../../lib/auth-return.mjs';
import {withDeadline,saveSupportMessage,supportError} from '../../lib/support-message.mjs';
import s from '../../components/account.module.css';
export default function SupportForm(){
 const [user,setUser]=useState(null),[ready,setReady]=useState(false),[subject,setSubject]=useState(''),[message,setMessage]=useState(''),[state,setState]=useState(''),[error,setError]=useState(''),[attempt,setAttempt]=useState(0);
 const busy=useRef(false),pending=useRef(null);
 useEffect(()=>{let active=true;setReady(false);setError('');withDeadline(()=>getSupabase().auth.getUser()).then(({data,error})=>{if(error&&data?.user)throw error;if(active)setUser(data?.user||null);}).catch(()=>{if(active)setError('We couldn’t open your account. Please try again or use the email address above.');}).finally(()=>{if(active)setReady(true);});return()=>{active=false;};},[attempt]);
 async function submit(e){
  e.preventDefault();if(busy.current)return;
  if(!subject.trim()||!message.trim()){setError('Please enter a subject and message.');return;}
  busy.current=true;setState('sending');setError('');
  try{
   const sb=getSupabase(),auth=await withDeadline(()=>sb.auth.getUser());
   if(auth.error||!auth.data.user||auth.data.user.id!==user?.id)throw {status:401};
   const draft={user_id:auth.data.user.id,subject:subject.trim(),message:message.trim()};
   const previous=pending.current;
   if(!previous||previous.user_id!==draft.user_id||previous.subject!==draft.subject||previous.message!==draft.message)pending.current={...draft,id:crypto.randomUUID()};
   await saveSupportMessage(sb,pending.current);
   pending.current=null;setSubject('');setMessage('');setState('saved');
  }catch(error){setError(supportError(error));setState('');}
  finally{busy.current=false;}
 }
 if(!ready)return <p role="status">Opening the contact form…</p>;
 if(!user)return <div>{error&&<p role="alert">{error} <button type="button" onClick={()=>setAttempt(x=>x+1)}>Try again</button></p>}<p><a href={authPath('login','/contact')}>Log in</a> to leave a private message for TEACH.</p></div>;
 return <form className={s.form} onSubmit={submit}><label className={s.field}>Subject<input required maxLength={150} value={subject} disabled={state==='sending'} onChange={e=>{setSubject(e.target.value);setState('');}}/></label><label className={s.field}>Your message<textarea required maxLength={6000} rows={6} value={message} disabled={state==='sending'} onChange={e=>{setMessage(e.target.value);setState('');}}/></label><button className={s.button} disabled={state==='sending'||state==='saved'}>{state==='sending'?'Saving…':state==='saved'?'Message saved for TEACH':'Send message'}</button>{state==='saved'&&<p role="status">Your message is saved for TEACH to review. Replies are not immediate.</p>}{error&&<p role="alert">{error}</p>}<p className={s.hint}>Your message and the email address on your TEACH account are saved privately for TEACH to review. Please omit passwords, payment details and private student records.</p></form>;
}
