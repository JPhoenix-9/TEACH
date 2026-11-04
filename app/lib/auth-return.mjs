import {gapProduct} from './gap-catalog.mjs';
import {blueprintProduct} from './blueprint-catalog.mjs';

const destinations=new Set(['/account','/my-desk','/resources','/contact','/front-porch','/records','/planner/workspace']);
// Return destinations are a small allowlist, never arbitrary URLs or auth routes.
export function safeReturnTo(value){
  if(typeof value!=='string'||/[\\\r\n]/.test(value))return '/account';
  if(destinations.has(value))return value;
  if(!value.startsWith('/'))return '/account';
  try{
    const url=new URL(value,'https://teach.invalid');
    if(url.origin!=='https://teach.invalid'||url.hash)return '/account';
    if([...url.searchParams.keys()].some(key=>key!=='product')||url.searchParams.getAll('product').length!==1)return '/account';
    const product=url.searchParams.get('product');
    if(url.pathname==='/curriculum/gap/enroll'&&gapProduct(product))return `${url.pathname}?product=${product}`;
    if(url.pathname==='/blueprint/enroll'&&blueprintProduct(product))return `${url.pathname}?product=${product}`;
  }catch{}
  return '/account';
}
export function authPath(mode,returnTo){
  const path=mode==='signup'?'/create-account':mode==='reset'?'/forgot-password':'/login';
  const next=safeReturnTo(returnTo);
  return next==='/account'?path:`${path}?next=${encodeURIComponent(next)}`;
}
export function accountSetupPath(returnTo){
  const next=safeReturnTo(returnTo);
  return next==='/account'?next:`/account?next=${encodeURIComponent(next)}`;
}
