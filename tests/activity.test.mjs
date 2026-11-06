import test from 'node:test';
import assert from 'node:assert/strict';
import {requestSchema,planSchema,profileComplete,profileFields,safeUrl,sourceUrls,buildActivityRequest,activityValidationMessage,ideaSchema,ideaPreviewSchema,householdSupplies} from '../app/generators/activity/model.mjs';
const base={action:'ideas',children:['11111111-1111-4111-8111-111111111111'],adults:1,guests:[],topic:'Bridges',duration:'Quick',budget:0};
test('initial choices reject verbose summaries and sprawling supplies while accepting concise complete choices',()=>{
 const idea={title:'Which paper bridge holds more?',summary:'Compare flat and folded paper bridges across the same gap. Predict which holds more coins, test both with the same coins, and explain how shape changes strength. Allow 20 minutes including setup and cleanup.',supplies:['2 sheets of paper','2 books','10–20 coins']};
 assert.equal(ideaPreviewSchema.safeParse(idea).success,true);
 for(const change of [{summary:'x'.repeat(601)},{title:'x'.repeat(91)},{supplies:Array(9).fill('Paper')},{supplies:['x'.repeat(101)]},{supplies:[]}]){
  assert.equal(ideaPreviewSchema.safeParse({...idea,...change}).success,false);
 }
 // Historical saved/submitted ideas remain readable; only newly generated previews are tighter.
 assert.equal(ideaSchema.safeParse({...idea,summary:'x'.repeat(601)}).success,true);
});
test('request rejects invalid participants, duration, budgets and missing trip dates',()=>{assert.ok(requestSchema.safeParse(base).success);for(const change of [{children:[]},{budget:-1},{duration:'Two hours'},{guests:[{age:-1,considerations:''}]},{action:'trips',trip:{location:'Kentucky',radius:-5,start:'2026-10-30',end:'2026-10-30',budget:0}}])assert.equal(requestSchema.safeParse({...base,...change}).success,false);});
test('all profile topics require responses; None is a valid answer',()=>{assert.equal(profileComplete({}),false);const p=Object.fromEntries(profileFields.map(([k])=>[k,'None']));assert.ok(profileComplete(p));p.interests=' ';assert.equal(profileComplete(p),false);});
test('only HTTPS source URLs may be offered as destination links',()=>{assert.equal(safeUrl('javascript:alert(1)'),null);assert.equal(safeUrl('http://localhost'),null);assert.equal(safeUrl('https://museum.example/visit'),'https://museum.example/visit');assert.deepEqual([...sourceUrls([{output:{results:[{url:'https://museum.example/visit'},{url:'javascript:bad'}]}}])],['https://museum.example/visit']);});
test('plan sessions cannot exceed two hours',()=>{const p={title:'Build',summary:'Make a bridge',duration:'Half Day',estimatedCost:0,supplies:[],preparation:[],sessions:[{title:'Build',minutes:121,steps:[]}],adaptations:[],discussion:[],safety:[]};assert.equal(planSchema.safeParse(p).success,false);p.sessions[0].minutes=120;assert.ok(planSchema.safeParse(p).success);});

test('ordinary $0 activities ignore the unopened field-trip form and accept optional guest considerations',()=>{
 const trip={location:'',radius:50,start:'',end:'',budget:0};
 for(const action of ['materials','ideas','plan','revise']){
  const input={...base,guests:[{age:8}],action};
  const request=buildActivityRequest(input,action,{trip,idea:{title:'Build bridges',summary:'Work together',kind:'activity'}});
  assert.equal(Object.hasOwn(request,'trip'),false);
  const parsed=requestSchema.safeParse(request);
  assert.equal(parsed.success,true);
  assert.equal(parsed.data.budget,0);
  assert.equal(parsed.data.guests[0].considerations,'');
  assert.equal(requestSchema.safeParse({...request,trip}).success,true);
 }
});
test('blank guest ages are not silently treated as six or zero; errors identify the age field',()=>{
 for(const age of ['',undefined,null,-1]){
  const result=requestSchema.safeParse({...base,guests:[{age,considerations:''}]});
  assert.equal(result.success,false);
  assert.match(activityValidationMessage(result.error),/age/);
  assert.doesNotMatch(activityValidationMessage(result.error),/dates/);
 }
 assert.equal(requestSchema.safeParse({...base,guests:[{age:0}]}).success,true);
});
test('field-trip searches and trip plans still require complete, ordered dates',()=>{
 const trip={location:'Greensburg, KY',radius:50,start:'2026-11-10',end:'2026-11-11',budget:20};
 for(const [action,idea] of [['trips',undefined],['plan',{title:'Museum',summary:'Explore',kind:'trip'}],['revise',{title:'Museum',summary:'Explore',kind:'trip'}]]){
  const request=buildActivityRequest(base,action,{trip,idea});
  assert.equal(requestSchema.safeParse(request).success,true);
  for(const change of [{trip:undefined},{trip:{...trip,start:''}},{trip:{...trip,end:'2026-11-09'}}]){
   const parsed=requestSchema.safeParse({...request,...change});
   assert.equal(parsed.success,false);
   assert.match(activityValidationMessage(parsed.error),/field trip/);
  }
 }
});

test('each idea requires a concrete supplies list before it can be displayed',()=>{
 const idea={title:'Build a bridge',summary:'Explore strength with household objects.'};
 assert.equal(ideaSchema.safeParse(idea).success,false);
 assert.equal(ideaSchema.safeParse({...idea,supplies:[]}).success,false);
 assert.equal(ideaSchema.safeParse({...idea,supplies:['Cardboard','String, thread, or yarn']}).success,true);
 assert.ok(householdSupplies.some(s=>s.includes('plastic containers')));
});
test('substitution requests preserve the selected idea, household constraints, and unavailable supplies',()=>{
 const input={...base,budget:0,buy:false,unavailableMaterials:['Glue']};
 const idea={title:'Bridge',summary:'Explore strength',supplies:['Cardboard','String'],kind:'activity'};
 const request=buildActivityRequest(input,'substitute',{idea,unavailableMaterials:['Glue','String'],trip:{location:'',radius:50,start:'',end:'',budget:0}});
 const parsed=requestSchema.safeParse(request);
 assert.equal(parsed.success,true);
 assert.equal(parsed.data.action,'substitute');
 assert.equal(parsed.data.budget,0);
 assert.equal(parsed.data.buy,false);
 assert.deepEqual(parsed.data.idea.supplies,idea.supplies);
 assert.deepEqual(parsed.data.unavailableMaterials,['Glue','String']);
 assert.equal(Object.hasOwn(parsed.data,'trip'),false);
 const tripIdea={...idea,kind:'trip'};
 assert.equal(requestSchema.safeParse({...request,idea:tripIdea}).success,false);
});
