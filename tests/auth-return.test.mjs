import {test} from 'node:test';
import assert from 'node:assert/strict';
import {safeReturnTo,authPath,accountSetupPath} from '../app/lib/auth-return.mjs';

test('GAP and individual Blueprint selections survive login and account setup',()=>{
 for(const next of ['/curriculum/gap/enroll?product=gap-35','/blueprint/enroll?product=blueprint-module-3','/blueprint/enroll?product=blueprint','/resources','/contact']){
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
