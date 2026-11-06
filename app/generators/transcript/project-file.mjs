import {readProject,safeFilename} from './model.mjs';
import {progressSchema} from './autosave.mjs';
export function projectFileText(record,progress){const p=readProject(JSON.stringify(record));return JSON.stringify({...p,workflow:progressSchema.parse(progress)},null,2);}
export function projectFileName(name){const base=String(name||'Transcript').replace(/\.teach-transcript\.json$/i,'');return `${safeFilename(base)}.teach-transcript.json`;}
export function supportsProjectFilePicker(scope=globalThis){return typeof scope.showSaveFilePicker==='function';}
export function pickProjectFile(name,scope=globalThis){return scope.showSaveFilePicker({id:'teach-transcript-project',suggestedName:projectFileName(name),types:[{description:'TEACH Transcript Project',accept:{'application/json':['.json']}}]});}
// Close is the commit: a failed or cancelled write must never report a saved file.
export async function createProjectFileSaver(handle){
 let expected=await (await handle.getFile()).text(),queue=Promise.resolve();
 return {name:handle.name,save(record,progress){const snapshot=structuredClone({record,progress});const pending=queue.then(async()=>{
  const text=projectFileText(snapshot.record,snapshot.progress),writable=await handle.createWritable({mode:'exclusive'});
  try{const current=await (await handle.getFile()).text();if(current!==expected&&current!==text)throw new Error('PROJECT_FILE_CHANGED');await writable.write(text);await writable.close();expected=text;return {name:handle.name};}catch(error){try{await writable.abort();}catch{}throw error;}
 });queue=pending.catch(()=>{});return pending;}};
}
export function projectFileError(error){
 if(error?.message==='PROJECT_FILE_CHANGED')return 'This file was changed outside this window. Use Save As to choose a separate file, or reopen the latest copy before editing further. Your answers are still on this page.';
 return 'The project file was not saved. Keep this page open and try Save Now or Save As again.';
}
