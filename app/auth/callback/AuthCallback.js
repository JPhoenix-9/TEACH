"use client";
import {useEffect,useState} from "react";
import {getSupabase} from "../../lib/supabase-browser";
import s from "../../components/account.module.css";
export default function AuthCallback(){
 const [state,setState]=useState("loading"),[message,setMessage]=useState("Checking your link…"),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{let alive=true;const hash=new URLSearchParams(window.location.hash.slice(1));const type=hash.get("type")||sessionStorage.getItem("teach-password-flow");if(type==="recovery"||type==="invite")sessionStorage.setItem("teach-password-flow",type);
  async function finish(){try{
   if(hash.has("error")||new URLSearchParams(window.location.search).has("error"))throw new Error("This link is invalid or has expired. Please request a fresh password-reset link or log in.");
   const {data,error}=await getSupabase().auth.getUser();
   if(error||!data.user)throw new Error("This link is invalid or has expired. Please request a fresh password-reset link or log in.");
   if(!alive)return;if(type==="recovery"||type==="invite"){setState("password");setMessage("Choose a password for your TEACH account.");}else window.location.replace("/account");
  }catch(error){if(alive){window.history.replaceState(null,"","/auth/callback");setState("error");setMessage(error.message);}}}finish();return()=>{alive=false;};
 },[]);
 async function save(e){e.preventDefault();if(password!==confirm){setMessage("The passwords do not match.");return;}setBusy(true);
  try{const {error}=await getSupabase().auth.updateUser({password});if(error)throw error;sessionStorage.removeItem("teach-password-flow");setPassword("");setConfirm("");window.location.replace("/account");}
  catch(error){setMessage(error.message||"We couldn’t save your password. Please try again.");}finally{setBusy(false);}}
 return <div className={s.panel}><p className={`${s.message} ${state==="error"?s.error:""}`} role="status">{message}</p>{state==="password"&&<form className={s.form} onSubmit={save}><label className={s.field}>New password<input type="password" required minLength={10} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><label className={s.field}>Confirm new password<input type="password" required minLength={10} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><button className={s.button} disabled={busy}>{busy?"Saving…":"Save password"}</button></form>}{state==="error"&&<div className={s.links}><a href="/forgot-password">Request a fresh reset link</a><a href="/login">Log in</a></div>}</div>;
}
