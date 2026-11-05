import test from 'node:test';
import assert from 'node:assert/strict';
import {withDeadline,saveSupportMessage,supportError} from '../app/lib/support-message.mjs';
test('stalled requests stop waiting and thrown failures propagate',async()=>{
 await assert.rejects(withDeadline(()=>new Promise(()=>{}),5),/SUPPORT_TIMEOUT/);
 await assert.rejects(withDeadline(()=>{throw Error('offline');}),/offline/);
});
test('failed save never reports success',async()=>{
 await assert.rejects(saveSupportMessage({from:()=>({insert:async()=>({error:{code:'42501'}})})},{id:'a'}));
 assert.match(supportError({code:'23503'}),/family profile/);
});
test('retry recognizes the same saved message without inserting a duplicate',async()=>{
 const record={id:'a',user_id:'u',subject:'Help',message:'A question'};
 const query={eq(){return this;},async single(){return {data:record};}};
 await saveSupportMessage({from:()=>({insert:async()=>({error:{code:'23505'}}),select:()=>query})},record);
 query.single=async()=>({data:{...record,message:'different'}});
 await assert.rejects(saveSupportMessage({from:()=>({insert:async()=>({error:{code:'23505'}}),select:()=>query})},record));
});
