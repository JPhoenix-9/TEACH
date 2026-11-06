import {safeUrl} from './model.mjs';

export class FieldTripSearchError extends Error{
 constructor(code){super(code);this.name='FieldTripSearchError';this.code=code;}
}

// An empty successful search is different from missing, malformed or failed tool output.
export function fieldTripEvidence(research){
 const steps=research?.steps||[];
 if(steps.some(step=>step.content?.some(part=>part.type==='tool-error')))throw new FieldTripSearchError('search_failed');
 const results=steps.flatMap(step=>step.toolResults||[]).filter(result=>result.toolName==='search');
 const calls=steps.flatMap(step=>step.toolCalls||[]).filter(call=>call.toolName==='search');
 if(!results.length||calls.some(call=>!results.some(result=>result.toolCallId===call.toolCallId)))throw new FieldTripSearchError('search_incomplete');
 const entries=[];
 for(const result of results){
  const output=result.output;
  if(output?.error)throw new FieldTripSearchError(output.error==='timeout'?'search_timeout':'search_failed');
  if(!Array.isArray(output?.results))throw new FieldTripSearchError('search_incomplete');
  for(const entry of output.results){
   const url=safeUrl(entry.url);
   if(url)entries.push({title:entry.title,url,snippet:entry.snippet,date:entry.date,lastUpdated:entry.lastUpdated});
  }
  if(output.results.length&&!output.results.some(entry=>safeUrl(entry.url)))throw new FieldTripSearchError('search_incomplete');
 }
 return {entries,urls:new Set(entries.map(entry=>entry.url))};
}

export function fieldTripOutcome(candidates,urls,trip){
 const trips=candidates.filter(item=>item.strongMatch&&item.dateSuitable&&Number.isFinite(item.distanceMiles)&&item.distanceMiles>=0&&item.distanceMiles<=trip.radius&&Number.isFinite(item.estimatedCost)&&item.estimatedCost>=0&&item.estimatedCost<=trip.budget&&urls.has(safeUrl(item.url))).map(item=>({...item,kind:'trip'}));
 return {
  status:trips.length?'results':'no_matches',trips,
  message:trips.length?'These options matched your topic, travel radius, dates and budget.':`I couldn’t verify any good field-trip options for this topic within ${trip.radius} miles for your dates and budget. Try a larger radius, different dates or a different budget.`,
  checkedAt:new Date().toISOString()
 };
}

export function fieldTripFailure(error){
 let current=error,timeout=false;
 for(let depth=0;current&&depth<5;depth++,current=current.cause||current.lastError){
  if(['TimeoutError','AbortError'].includes(current.name)||current.code==='search_timeout')timeout=true;
 }
 return timeout?{
  code:'trip_search_timeout',error:'The field-trip search timed out before it finished. Your search settings are still here; please try again.'
 }:{code:'trip_search_failed',error:'The field-trip search couldn’t finish checking destinations. Your search settings are still here; please try again.'};
}
