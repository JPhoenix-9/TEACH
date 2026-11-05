"use client";
import {useEffect,useState} from "react";
import {getSupabase} from "../lib/supabase-browser";

export default function AccountLinks(){
 const [state,setState]=useState("loading");
 useEffect(()=>{
  let active=true,receivedEvent=false;
  const sb=getSupabase();
  const {data:listener}=sb.auth.onAuthStateChange((_event,session)=>{
   receivedEvent=true;
   if(active)setState(session?.user?"signedIn":"signedOut");
  });
  sb.auth.getSession().then(({data,error})=>{
   if(active&&!receivedEvent)setState(error?"error":data.session?.user?"signedIn":"signedOut");
  }).catch(()=>{if(active&&!receivedEvent)setState("error");});
  return ()=>{active=false;listener.subscription.unsubscribe();};
 },[]);
 if(state==="signedOut")return <><a className="create-account" href="/create-account">Create a Free Account</a><a className="login-button" href="/login">Log In</a></>;
 return <a className="login-button" href="/account">{state==="loading"?"Account":"My Account"}</a>;
}
