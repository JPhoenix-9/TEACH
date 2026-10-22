"use client";
import {useState} from "react";
import {callbackUrl,getSupabase} from "../lib/supabase-browser";
import s from "./account.module.css";
export default function AuthForm({mode="login"}){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState("");
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[failed,setFailed]=useState(false);
 const signup=mode==="signup",reset=mode==="reset";
 async function submit(e){e.preventDefault();setMessage("");setFailed(false);
  if(signup&&password!==confirm){setFailed(true);setMessage("The passwords do not match.");return;}setBusy(true);
  try{const sb=getSupabase();let result;
   if(reset)result=await sb.auth.resetPasswordForEmail(email.trim(),{redirectTo:callbackUrl()});
   else if(signup)result=await sb.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:callbackUrl()}});
   else result=await sb.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;setPassword("");setConfirm("");
   if(reset)setMessage("If this address has an account, a password-reset link is on its way. Check your inbox and spam folder.");
   else if(signup&&!result.data.session)setMessage("Check your email for the confirmation link. After confirming, you can add your family’s information. If you already have an account, use Log in or Forgot password.");
   else window.location.assign("/account");
  }catch(error){setFailed(true);setMessage(error.message||"We couldn’t complete that request. Please try again.");}finally{setBusy(false);}}
 return <div className={s.panel}><form className={s.form} onSubmit={submit}>
  <label className={s.field}>Email address<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label>
  {!reset&&<label className={s.field}>Password<input type="password" required minLength={signup?10:undefined} autoComplete={signup?"new-password":"current-password"} value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/>{signup&&<span className={s.hint}>Use at least 10 characters.</span>}</label>}
  {signup&&<label className={s.field}>Confirm password<input type="password" required minLength={10} autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} disabled={busy}/></label>}
  {signup&&<p className={s.hint}>Your free account stores your family profile. Products unlock separately when purchased. You can choose whether to receive marketing emails when you complete your profile.</p>}
  <button className={s.button} disabled={busy} type="submit">{busy?"Please wait…":reset?"Send reset link":signup?"Create free account":"Log in"}</button>
  {message&&<p className={`${s.message} ${failed?s.error:""}`} role={failed?"alert":"status"}>{message}</p>}
 <p className={s.hint}>TEACH accounts are for parents and other adults. Read <a href="/privacy">Privacy</a> and <a href="/terms">Using TEACH</a>.</p></form><div className={s.links}>{mode!=="login"&&<a href="/login">Log in</a>}{mode!=="signup"&&<a href="/create-account">Create a free account</a>}{!reset&&<a href="/forgot-password">Forgot password?</a>}</div></div>;
}
