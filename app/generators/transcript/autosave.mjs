import {z} from 'zod';
import {readProject} from './model.mjs';
export const progressSchema=z.object({screen:z.enum(['home','student','school','orientation','course','grading','titles','transcript','downloads','college','school-result','history']),subjectIndex:z.number().int().min(0).max(8),discovery:z.boolean(),titles:z.string().max(12000),reportIndex:z.number().int().min(-1).max(99),issueIndex:z.number().int().min(0).max(29)});
let connection;
function database(){
 if(!globalThis.indexedDB)return Promise.reject(new Error('AUTOSAVE_UNAVAILABLE'));
 if(!connection)connection=new Promise((resolve,reject)=>{
  const request=indexedDB.open('teach-transcript-drafts',1);
  request.onupgradeneeded=()=>{const store=request.result.createObjectStore('drafts',{keyPath:['owner','id']});store.createIndex('owner','owner');};
  request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('AUTOSAVE_UNAVAILABLE'));
  request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();connection=null;};resolve(db);};
 }).catch(error=>{connection=null;throw error;});
 return connection;
}
export async function listDrafts(owner){
 const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('drafts','readonly'),request=tx.objectStore('drafts').index('owner').getAll(owner);tx.oncomplete=()=>resolve(request.result.map(({id,record,updatedAt})=>({id,name:record.student.name,licenseId:record.licenseId,updatedAt})).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)));tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
}
export async function readDraft(owner,id){
 const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('drafts','readonly'),request=tx.objectStore('drafts').get([owner,id]);tx.oncomplete=()=>{try{const row=request.result;if(!row){resolve(null);return;}resolve({...row,record:readProject(JSON.stringify(row.record)),progress:progressSchema.parse(row.progress)});}catch(error){reject(error);}};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
}
export async function writeDraft(owner,record,progress,revision){
 if(!owner)throw new Error('AUTOSAVE_UNAVAILABLE');
 const snapshot={record:readProject(JSON.stringify(record)),progress:progressSchema.parse(progress)};
 const db=await database();return new Promise((resolve,reject)=>{
  const tx=db.transaction('drafts','readwrite'),store=tx.objectStore('drafts'),request=store.get([owner,record.id]);let next,error;
  request.onsuccess=()=>{const current=request.result;if((current?.revision||0)!==revision){error=new Error('AUTOSAVE_CONFLICT');tx.abort();return;}next={...snapshot,owner,id:record.id,revision:revision+1,updatedAt:new Date().toISOString()};store.put(next);};
  tx.oncomplete=()=>resolve(next);tx.onerror=()=>reject(error||tx.error);tx.onabort=()=>reject(error||tx.error||new Error('AUTOSAVE_UNAVAILABLE'));
 });
}
// One ordered writer prevents an older save finishing after newer answers.
export function createDraftSaver(owner,write=writeDraft){
 const revisions=new Map();let queue=Promise.resolve();
 return {seed(id,revision){revisions.set(id,revision);},save(record,progress){const snapshot=structuredClone({record,progress});const pending=queue.then(async()=>{const saved=await write(owner,snapshot.record,snapshot.progress,revisions.get(record.id)||0);revisions.set(record.id,saved.revision);return saved;});queue=pending.catch(()=>{});return pending;}};
}
export function autosaveError(error){
 if(error?.message==='AUTOSAVE_CONFLICT')return 'This project was changed in another tab. Download a backup of these answers before reopening the saved project. These answers have not overwritten the other tab’s work.';
 if(error?.name==='QuotaExceededError')return 'This device is out of space for automatic saving. Your answers are still on this page. Download a project backup before closing it.';
 return 'Automatic saving did not finish on this device. Your answers are still on this page. Try saving again or download a project backup before leaving.';
}
