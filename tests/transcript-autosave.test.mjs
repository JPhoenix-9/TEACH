import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraftSaver,progressSchema,autosaveError} from '../app/generators/transcript/autosave.mjs';
import {newProject,readProject} from '../app/generators/transcript/model.mjs';
const checkpoint={screen:'course',subjectIndex:6,discovery:true,titles:'',reportIndex:-1,issueIndex:0};
test('automatic save orders snapshots, retains unfinished learning and resumes the correct subject',async()=>{
 const calls=[];let release;const gate=new Promise(r=>release=r);
 const saver=createDraftSaver('parent',async(owner,record,progress,revision)=>{if(!calls.length)await gate;calls.push({owner,record,progress,revision});return {revision:revision+1};});
 const p=newProject(crypto.randomUUID(),crypto.randomUUID());p.titleDrafts={'Fine Arts':'Music'};p.discoveryDrafts={'Fine Arts':{facts:'Parent: Two years of piano lessons',answer:'Daily practice',result:null,proposal:null,added:false}};
 const first=saver.save(p,checkpoint);p.discoveryDrafts['Fine Arts'].answer='Updated practice details';const next=saver.save(p,{...checkpoint,discovery:false,subjectIndex:7});
 release();await Promise.all([first,next]);assert.deepEqual(calls.map(x=>x.revision),[0,1]);assert.equal(calls[0].record.discoveryDrafts['Fine Arts'].answer,'Daily practice');assert.equal(calls[1].record.discoveryDrafts['Fine Arts'].answer,'Updated practice details');assert.equal(calls[1].progress.subjectIndex,7);assert.equal(calls[0].owner,'parent');assert.deepEqual(readProject(JSON.stringify(calls[1].record)),calls[1].record);
});
test('failed storage never advances the saved revision and retry keeps the latest answers',async()=>{
 let fail=true;const revisions=[];const saver=createDraftSaver('parent',async(owner,record,progress,revision)=>{revisions.push(revision);if(fail)throw new Error('offline');return {revision:revision+1};});const p=newProject(crypto.randomUUID(),crypto.randomUUID());saver.seed(p.id,4);await assert.rejects(saver.save(p,checkpoint),/offline/);fail=false;await saver.save(p,checkpoint);assert.deepEqual(revisions,[4,4]);assert.match(autosaveError({name:'QuotaExceededError'}),/out of space/);assert.match(autosaveError(Error('AUTOSAVE_CONFLICT')),/another tab/);
});
test('each student keeps an independent save revision and restored positions are validated',async()=>{
 const revisions=[];const saver=createDraftSaver('parent',async(owner,record,progress,revision)=>{revisions.push(revision);return {revision:revision+1};});const a=newProject(crypto.randomUUID(),crypto.randomUUID()),b=newProject(crypto.randomUUID(),crypto.randomUUID());saver.seed(a.id,7);await saver.save(a,checkpoint);await saver.save(b,checkpoint);await saver.save(a,checkpoint);assert.deepEqual(revisions,[7,0,8]);assert(progressSchema.safeParse(checkpoint).success);assert(!progressSchema.safeParse({...checkpoint,subjectIndex:9}).success);
});

test('IndexedDB commits survive a new writer, isolate accounts, and reject stale tabs',async()=>{
 const {indexedDB}=await import('fake-indexeddb');globalThis.indexedDB=indexedDB;
 const {writeDraft,readDraft,listDrafts}=await import('../app/generators/transcript/autosave.mjs');
 const owner=crypto.randomUUID(),other=crypto.randomUUID(),p=newProject(crypto.randomUUID(),crypto.randomUUID());p.student.name='Autosave Test Student';p.discoveryDrafts={'Fine Arts':{facts:'Weekly piano lessons',answer:'Practiced five days a week',result:null,proposal:null,added:false}};
 const writer=createDraftSaver(owner);await writer.save(p,checkpoint);
 const row=await readDraft(owner,p.id);assert.equal(row.revision,1);assert.deepEqual(row.record,p);assert.deepEqual(row.progress,checkpoint);assert.equal((await listDrafts(owner))[0].name,p.student.name);assert.equal(await readDraft(other,p.id),null);assert.deepEqual(await listDrafts(other),[]);
 const refreshed=createDraftSaver(owner);refreshed.seed(p.id,row.revision);p.student.name='Corrected Name';await refreshed.save(p,{...checkpoint,screen:'grading',discovery:false});assert.equal((await readDraft(owner,p.id)).record.student.name,'Corrected Name');
 await assert.rejects(writer.save(p,checkpoint),/AUTOSAVE_CONFLICT/);assert.equal((await readDraft(owner,p.id)).progress.screen,'grading');
 const second=newProject(crypto.randomUUID(),crypto.randomUUID());await writeDraft(owner,second,{...checkpoint,screen:'student'},0);assert.equal((await listDrafts(owner)).length,2);
});
