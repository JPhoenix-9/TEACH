"use client";
import {createClient} from "@supabase/supabase-js";

import {supabaseProjectUrl, supabasePublishableKey} from './supabase-config.mjs';

let client;
export function getSupabase(){
  if(!client)client=createClient(supabaseProjectUrl,supabasePublishableKey,{auth:{flowType:"implicit",persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}
export function callbackUrl(){return `${window.location.origin}/auth/callback`;}
