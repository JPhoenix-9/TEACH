import {mock} from 'node:test';
import assert from 'node:assert/strict';
let mode='results',calls=[];
const uid='11111111-1111-4111-8111-111111111111',kid='22222222-2222-4222-8222-222222222222';
const profile=Object.fromEntries(['interests','strengths','reading','learning','sensory','mobility','frustrations','considerations'].map(key=>[key,'PRIVATE_PROFILE_FIXTURE']));
mock.module('@supabase/supabase-js',{namedExports:{createClient:()=>({
 auth:{getUser:async()=>({data:{user:{id:uid}},error:null})},
 rpc:async name=>({data:name==='has_activity_access',error:null}),
 from:name=>{const result={data:name==='family_children'?[{id:kid,age_years:12,grade_level:'7'}]:[{child_id:kid,details:profile}],error:null};const query={select(){return this;},eq(){return this;},is(){return this;},in(){return Promise.resolve(result);}};return query;}
})}});
mock.module('ai',{namedExports:{
 gateway:{tools:{perplexitySearch:config=>({config})}},Output:{object:options=>options},stepCountIs:n=>({maximumSteps:n}),
 generateText:async options=>{
  calls.push(options);
  if(options.tools){
   assert.equal(options.reasoning,'low');assert.equal(options.maxRetries,0);assert.equal(options.stopWhen.maximumSteps,3);
   assert.equal(options.tools.search.config.maxTokens,6000);
   assert(!JSON.stringify({system:options.system,prompt:options.prompt}).includes('PRIVATE_PROFILE_FIXTURE'));
   if(mode==='timeout')throw Object.assign(new Error('upstream private detail'),{name:'TimeoutError'});
   const output=mode==='tool_error'?{error:'api_error',message:'upstream private detail'}:{id:'fixture',results:mode==='empty'?[]:[{title:'Nature Center',url:'https://nature.example/visit',snippet:'Official visitor information'}]};
   return {steps:[{toolCalls:[{toolName:'search',toolCallId:'one'}],toolResults:[{toolName:'search',toolCallId:'one',output}]}]};
  }
  assert.equal(options.reasoning,'low');assert.equal(options.maxRetries,0);
  return {output:{trips:[{title:'Nature center',summary:'Observe butterfly habitats.',supplies:['Notebook'],url:'https://nature.example/visit',evidence:'Official visitor information',distanceMiles:mode==='filtered'?51:20,estimatedCost:0,dateSuitable:true,strongMatch:true}]}};
 }
}});
const {POST}=await import('../../app/api/activity/route.js');
function request(){return new Request('https://teachforlove.com/api/activity',{method:'POST',headers:{origin:'https://teachforlove.com',authorization:'Bearer fixture-token','content-type':'application/json'},body:JSON.stringify({action:'trips',children:[kid],adults:1,guests:[],topic:'Butterflies',duration:'Quick',budget:0,trip:{location:'Sample Town, KY',radius:50,start:'2026-11-07',end:'2026-11-07',budget:0}})});}
for(mode of ['results','empty','filtered','timeout','tool_error']){
 calls=[];const response=await POST(request()),body=await response.json();
 if(mode==='timeout'||mode==='tool_error'){assert.equal(response.status,503);assert.equal(body.code,mode==='timeout'?'trip_search_timeout':'trip_search_failed');assert(!JSON.stringify(body).includes('upstream private detail'));}
 else{assert.equal(response.status,200);assert.equal(body.status,mode==='results'?'results':'no_matches');assert.equal(body.trips.length,mode==='results'?1:0);}
 if(mode==='empty')assert.equal(calls.length,1,'No extra AI call is needed for a successful empty search.');
}
console.log('PASS actual route: results, empty search, filtered matches, timeout, tool failure, privacy, bounded research');
