import test from 'node:test';
import assert from 'node:assert/strict';
import {fieldTripEvidence,fieldTripOutcome,fieldTripFailure} from '../app/generators/activity/field-trip-search.mjs';

const search=output=>({steps:[{toolResults:[{toolName:'search',toolCallId:'one',output}],toolCalls:[{toolName:'search',toolCallId:'one'}]}]});
test('only a successful empty search can establish a completed search with no results',()=>{
 const evidence=fieldTripEvidence(search({id:'fixture',results:[]}));
 const outcome=fieldTripOutcome([],evidence.urls,{radius:50,budget:0});
 assert.equal(outcome.status,'no_matches');assert.deepEqual(outcome.trips,[]);assert.match(outcome.message,/50 miles/);assert.match(outcome.message,/larger radius/);
 for(const response of [{steps:[]},search({}),search({error:'api_error',message:'fixture failure'}),{steps:[{content:[{type:'tool-error'}]}]},search({results:[{url:'http://unsafe.test'}]})])assert.throws(()=>fieldTripEvidence(response));
 const pending=search({id:'fixture',results:[]});pending.steps.push({toolCalls:[{toolName:'search',toolCallId:'unfinished'}]});assert.throws(()=>fieldTripEvidence(pending));
});
test('unverified, out-of-radius, over-budget, wrong-date and negative-distance destinations cannot be shown',()=>{
 const evidence=fieldTripEvidence(search({id:'fixture',results:[{title:'Nature Center',url:'https://nature.example/visit',snippet:'Official visitor information.'}]}));
 const candidate={title:'Nature Center',url:'https://nature.example/visit',strongMatch:true,dateSuitable:true,distanceMiles:20,estimatedCost:0,supplies:['Notebook']};
 const invalid=[{strongMatch:false},{dateSuitable:false},{distanceMiles:51},{distanceMiles:-1},{estimatedCost:21},{url:'https://invented.example/visit'}].map(change=>({...candidate,...change}));
 const result=fieldTripOutcome([candidate,...invalid],evidence.urls,{radius:50,budget:20});
 assert.equal(result.status,'results');assert.equal(result.trips.length,1);assert.equal(result.trips[0].kind,'trip');
 assert.equal(fieldTripOutcome(invalid,evidence.urls,{radius:50,budget:20}).status,'no_matches');
});
test('source links come from actual search results, not URLs in tool input or model narrative',()=>{
 const response=search({id:'fixture',results:[{url:'https://nature.example/visit',title:'Nature center',snippet:'Evidence'}]});
 response.steps[0].toolResults[0].input={url:'https://invented.example/'};
 response.text='https://another-invented.example/';
 assert.deepEqual([...fieldTripEvidence(response).urls],['https://nature.example/visit']);
});
test('timeouts and tool failures are not represented as no matching destinations',()=>{
 for(const error of [Object.assign(new Error(),{name:'TimeoutError'}),{cause:{name:'AbortError'}},{lastError:{code:'search_timeout'}}]){
  const failure=fieldTripFailure(error);assert.equal(failure.code,'trip_search_timeout');assert.match(failure.error,/timed out/);assert.doesNotMatch(failure.error,/no good|couldn.t find/i);
 }
 let toolError;try{fieldTripEvidence(search({error:'timeout',message:'private upstream details'}));}catch(error){toolError=error;}
 assert.equal(fieldTripFailure(toolError).code,'trip_search_timeout');
 assert.equal(fieldTripFailure(new Error('private upstream details')).code,'trip_search_failed');
 assert.doesNotMatch(fieldTripFailure(new Error('private upstream details')).error,/private upstream/);
});
