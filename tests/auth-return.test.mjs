import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safeReturnTo,authPath,accountSetupPath,resolveLoginReturn} from '../app/lib/auth-return.mjs';

test('GAP and individual Blueprint selections survive login and account setup',()=>{
 for(const next of ['/curriculum/gap/enroll?product=gap-35','/blueprint/enroll?product=blueprint-module-3','/blueprint/enroll?product=blueprint','/resources','/contact','/generators','/generators/activity']){
  assert.equal(safeReturnTo(next),next);
  assert.equal(new URL(authPath('login',next),'https://teach.invalid').searchParams.get('next'),next);
  assert.equal(new URL(accountSetupPath(next),'https://teach.invalid').searchParams.get('next'),next);
 }
});
test('return links reject external redirects, auth loops and invalid product selections',()=>{
 for(const next of [undefined,null,['/resources'],'https://evil.example','//evil.example/resources','/\\evil.example','/resources\n','javascript:alert(1)','/login','/auth/callback','/blueprint/enroll?product=blueprint-module-7','/curriculum/gap/enroll?product=gap-35&next=https://evil.example','/curriculum/gap/enroll?product=gap-35&product=gap-k2','/resources#access_token=secret']){
  assert.equal(safeReturnTo(next),'/account',String(next));
  assert.equal(authPath('login',next),'/login');
 }
});

test('login returns to an explicit destination, otherwise a same-site source page, otherwise home',()=>{
 const origin='https://teachforlove.com';
 assert.equal(resolveLoginReturn('/generators/activity',origin+'/blueprint',origin),'/generators/activity');
 for(const path of ['/','/blueprint','/about','/generators','/generators/activity','/library/a-family-adventure','/search?q=nature','/curriculum/gap/enroll?product=gap-35']){
  assert.equal(resolveLoginReturn(undefined,origin+path,origin),path);
  assert.equal(resolveLoginReturn(path,'',origin),path);
 }
 for(const referrer of ['', 'https://evil.example/blueprint', origin+'/login',origin+'/auth/callback',origin+'/login?next=%2Fblueprint',origin+'/resources#access_token=secret']){
  assert.equal(resolveLoginReturn(undefined,referrer,origin),'/');
 }
 for(const explicit of ['https://evil.example','//evil.example/resources','/login','/resources?access_token=secret','/resources%2f..%2flogin']){
  assert.equal(resolveLoginReturn(explicit,origin+'/blueprint',origin),'/');
 }
 assert.equal(accountSetupPath(undefined),'/account');
 assert.equal(accountSetupPath('/generators/activity'),'/account?next=%2Fgenerators%2Factivity');
});
