"use client";
import {useEffect,useState} from "react";
import {getSupabase} from "../lib/supabase-browser";
import s from "../components/account.module.css";
export default function FamilyAccount(){
 const [user,setUser]=useState(null),[ready,setReady]=useState(false),[busy,setBusy]=useState(false),[name,setName]=useState(""),[phone,setPhone]=useState(""),[marketing,setMarketing]=useState(false),[children,setChildren]=useState([]),[message,setMessage]=useState(""),[failed,setFailed]=useState(false),[saved,setSaved]=useState(false),[administrator,setAdministrator]=useState(false);
 useEffect(()=>{let alive=true;const sb=getSupabase();async function load(){try{
  const {data,error}=await sb.auth.getUser();if(error||!data.user){if(alive)window.location.replace("/login");return;}
  const [profile,kids,admin]=await Promise.all([sb.from("family_profiles").select("parent_name,phone,marketing_opt_in").eq("user_id",data.user.id).maybeSingle(),sb.from("family_children").select("id,name,age_years,grade_level,archived_at").eq("user_id",data.user.id).is("archived_at",null).order("created_at"),sb.from("teach_administrators").select("user_id").eq("user_id",data.user.id).maybeSingle()]);
  if(profile.error)throw profile.error;if(kids.error)throw kids.error;if(!alive)return;
  setAdministrator(!!admin.data);setUser(data.user);setName(profile.data?.parent_name||"");setPhone(profile.data?.phone||"");setMarketing(profile.data?.marketing_opt_in||false);setChildren(kids.data||[]);setReady(true);
 }catch(error){if(alive){setFailed(true);setMessage("We couldn’t load your family profile. Refresh this page to try again. Your saved records have not been changed.");}}}load();
 const {data:listener}=sb.auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT")window.location.replace("/login");});
 return()=>{alive=false;listener.subscription.unsubscribe();};},[]);
 function clearFeedback(){setSaved(false);setFailed(false);setMessage("");}
 function changeChild(id,field,value){clearFeedback();setChildren(old=>old.map(c=>c.id===id?{...c,[field]:value}:c));}
 async function save(e){e.preventDefault();setBusy(true);setFailed(false);clearFeedback();try{
  const sb=getSupabase();const {data,error:authError}=await sb.auth.getUser();if(authError||!data.user||data.user.id!==user.id)throw new Error("Your session has ended. Please log in again.");
  const {error}=await sb.rpc("save_family_profile",{p_parent_name:name.trim(),p_phone:phone.trim(),p_marketing_opt_in:marketing,p_children:children.map(c=>({id:c.id,name:c.name.trim(),age_years:c.age_years===""||c.age_years==null?null:Number(c.age_years),grade_level:c.grade_level.trim(),archived_at:c.archived_at||null}))});if(error)throw error;
  setChildren(old=>old.filter(c=>!c.archived_at).map(c=>({...c,fresh:false})));setSaved(true);
 }catch(error){setFailed(true);setMessage(error.message||"We couldn’t finish saving. Please try again; your entries remain on this screen.");}finally{setBusy(false);}}
 async function logout(){setBusy(true);clearFeedback();const {error}=await getSupabase().auth.signOut();if(error){setFailed(true);setMessage("We couldn’t sign you out. Please try again.");setBusy(false);}else window.location.replace("/login");}
 return <div className={s.panel}>{!ready?<p className={`${s.message} ${failed?s.error:""}`} role={failed?"alert":"status"}>{message||"Opening your family profile…"}</p>:<>
 <p className={s.hint}>Your family details are private. <a href="/privacy">Privacy and your choices</a></p><p className={s.hint}>Signed in as {user.email}</p><form className={s.form} onSubmit={save}>
 <label className={s.field}>Parent’s name<input required value={name} autoComplete="name" onChange={e=>{setName(e.target.value);clearFeedback();}} disabled={busy}/></label>
 <label className={s.field}>Phone number (optional)<input type="tel" autoComplete="tel" value={phone} onChange={e=>{setPhone(e.target.value);clearFeedback();}} disabled={busy}/></label>
 <h2>Your children</h2><p className={s.hint}>Number of children: {children.filter(c=>!c.archived_at).length}. Add each child’s name and age. Grade is optional.</p>
 {children.filter(c=>!c.archived_at).map((child,i)=><fieldset className={s.children} key={child.id} disabled={busy}><legend>Child {i+1}</legend><div className={s.row}><label className={s.field}>Child’s name<input required value={child.name} onChange={e=>changeChild(child.id,"name",e.target.value)}/></label><label className={s.field}>Age<input type="number" min="0" step="1" required value={child.age_years??""} onChange={e=>changeChild(child.id,"age_years",e.target.value)}/></label></div><label className={s.field}>Grade (optional)<input value={child.grade_level} onChange={e=>changeChild(child.id,"grade_level",e.target.value)}/></label><button type="button" className={`${s.button} ${s.secondary}`} onClick={()=>{if(child.fresh){clearFeedback();setChildren(old=>old.filter(c=>c.id!==child.id));}else changeChild(child.id,"archived_at",new Date().toISOString());}}>Remove from active profile</button></fieldset>)}
 <button type="button" disabled={busy} className={`${s.button} ${s.secondary}`} onClick={()=>{clearFeedback();setChildren(old=>[...old,{id:crypto.randomUUID(),fresh:true,name:"",age_years:"",grade_level:"",archived_at:null}]);}}>Add a child</button>
 <p className={s.hint}>Removing a child from this profile archives their listing when you save. It does not delete learning records.</p>
 <label className={s.check}><input type="checkbox" checked={marketing} onChange={e=>{setMarketing(e.target.checked);clearFeedback();}} disabled={busy}/><span>Yes, TEACH may email me homeschool encouragement, resources, product news and offers. I can change this choice here. Account and security emails are separate.</span></label>
 <button type="submit" className={s.button} disabled={busy||saved}><span aria-live="polite" aria-atomic="true">{busy?"Saving…":saved?"Family profile saved":"Save family profile"}</span></button>
 {message&&<p className={`${s.message} ${failed?s.error:""}`} role={failed?"alert":"status"}>{message}</p>}
 </form><p className={s.status}>Your account is free. Purchased tools unlock separately. Your Planner records stay private and follow your account across devices. Editing requires an active Planner subscription; saved history remains readable when it expires.</p><div className={s.links}>{administrator&&<a href="/admin">TEACH administration</a>}<a href="/my-desk">My Desk</a><a href="/planner/workspace">Your Planner</a><a href="/records">Children’s Records</a><a href="/resources">Your resources</a><a href="/forgot-password">Reset password</a><button type="button" disabled={busy} className={`${s.button} ${s.secondary}`} onClick={logout}>Log out</button></div></> }</div>;
}
