"use client";
import {createClient} from "@supabase/supabase-js";

// Publishable browser key only. Private family data is protected by database RLS.
const projectUrl="https://jhooodlcvcpnzcpreqmu.supabase.co";
const publishableKey="sb_publishable_p7jhF0mOMKFvQmN4Kkp3ng_VxvaHECD";
let client;
export function getSupabase(){
  if(!client)client=createClient(projectUrl,publishableKey,{auth:{flowType:"implicit",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}
export function callbackUrl(){return `${window.location.origin}/auth/callback`;}
