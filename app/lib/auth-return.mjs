import {gapProduct} from './gap-catalog.mjs';
import {blueprintProduct} from './blueprint-catalog.mjs';

const destinations=new Set(["/about","/account","/blueprint","/contact","/curriculum/gap","/curriculum","/front-porch","/generators/activity","/generators","/generators/transcript","/library","/my-desk","/","/planner","/planner/preview","/planner/workspace","/privacy","/records","/refunds","/resources","/search","/start","/terms","/webinars/5-shifts/register","/webinars/common-questions/register","/webinars","/webinars/watch","/wishing-well"]);
// Only known TEACH pages can be return destinations. Auth/token routes cannot loop.
export function safeReturnTo(value,fallback='/account'){
 fallback=fallback==='/'?'/':'/account';
 if(typeof value!=='string'||/[\\\r\n\x00-\x1f\x7f]/.test(value)||!value.startsWith('/')||value.startsWith('//'))return fallback;
 try{
  const url=new URL(value,'https://teach.invalid');
  if(url.origin!=='https://teach.invalid'||url.hash||url.pathname.includes('%'))return fallback;
  const keys=[...url.searchParams.keys()];
  if(!keys.length&&(destinations.has(url.pathname)||/^\/library\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(url.pathname)))return url.pathname;
  if(keys.length===1&&keys[0]==='product'){
   const product=url.searchParams.get('product');
   if(url.pathname==='/curriculum/gap/enroll'&&gapProduct(product))return `${url.pathname}?product=${product}`;
   if(url.pathname==='/blueprint/enroll'&&blueprintProduct(product))return `${url.pathname}?product=${product}`;
  }
  if(url.pathname==='/search'&&keys.length===1&&keys[0]==='q'&&(url.searchParams.get('q')||'').length<=500)return url.pathname+url.search;
 }catch{}
 return fallback;
}
export function resolveLoginReturn(explicit,referrer,origin){
 if(explicit!==undefined&&explicit!==null)return safeReturnTo(explicit,'/');
 try{
  const previous=new URL(referrer);
  if(previous.origin===origin&&!previous.hash)return safeReturnTo(previous.pathname+previous.search,'/');
 }catch{}
 return '/';
}
export function authPath(mode,returnTo){
 const path=mode==='signup'?'/create-account':mode==='reset'?'/forgot-password':'/login';
 const next=safeReturnTo(returnTo);
 return next==='/account'?path:`${path}?next=${encodeURIComponent(next)}`;
}
export function accountSetupPath(returnTo){
 const next=safeReturnTo(returnTo);
 return next==='/'||next==='/account'?'/account':`/account?next=${encodeURIComponent(next)}`;
}
