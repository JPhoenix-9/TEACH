// Synthetic-data browser regression. Requires Playwright; never contacts live Supabase.
const {chromium}=require('playwright');
const path=require('node:path');
const repository=path.resolve(__dirname,'..');
const assert=require('node:assert/strict');
const uid='11111111-1111-4111-8111-111111111111',kid='22222222-2222-4222-8222-222222222222',archive='33333333-3333-4333-8333-333333333333';
const fields=['interests','strengths','reading','learning','sensory','mobility','frustrations','considerations'];
const idea={title:'Wing Symmetry Measurement Challenge',summary:'Compare wing shapes and explain mirror symmetry.',supplies:['Paper','Ruler','Scissors']};
const plan={...idea,duration:'20 minutes',estimatedCost:0,preparation:['Clear a table.'],sessions:[{title:'Observe and compare',minutes:20,steps:['Draw and fold a wing pair.','Measure matching points.','Explain the evidence for symmetry.']}],adaptations:[{child:'Child 1',role:'Measure and explain.'}],discussion:['What makes these halves symmetrical?'],safety:['Use scissors carefully.']};
const input={children:[kid],adults:1,guests:[],topic:'Butterflies',duration:'Quick',budget:0,materials:[],otherMaterials:'',buy:false,direction:'',unavailableMaterials:[]};
const user={id:uid,aud:'authenticated',role:'authenticated',email:'fixture@example.test',app_metadata:{provider:'email'},user_metadata:{},created_at:new Date().toISOString()};
const token=[Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url'),Buffer.from(JSON.stringify({sub:uid,role:'authenticated',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url'),'fixture'].join('.');
async function fixture(browser,status,width=1280){
 const ctx=await browser.newContext({viewport:{width,height:900}});let saved=null,notes=[],failSave=false,tripMode='results';
 await ctx.addInitScript(({user,token})=>{if(location.origin!=='http://127.0.0.1:3101')return;localStorage.setItem('sb-jhooodlcvcpnzcpreqmu-auth-token',JSON.stringify({access_token:token,refresh_token:'fixture-refresh',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user}));},{user,token});
 await ctx.route('https://jhooodlcvcpnzcpreqmu.supabase.co/**',async route=>{
  const req=route.request(),url=new URL(req.url()),name=url.pathname.split('/').pop();let data=[];let code=200;
  if(url.pathname==='/auth/v1/user')data=user;
  else if(name==='has_activity_access')data=true;
  else if(name==='family_children')data=[{id:kid,name:'Sample Child',age_years:12,grade_level:'7',archived_at:null}];
  else if(name==='child_learning_profiles')data=[{child_id:kid,details:Object.fromEntries(fields.map(f=>[f,'None']))}];
  else if(name==='planner_subscriptions'){
   if(status==='error'){code=500;data={message:'fixture subscription check failed'};}
   else data=status==='active'?[{starts_at:'2026-01-01T00:00:00Z',ends_at:'2028-01-01T00:00:00Z',revoked_at:null}]:[];
  }
  else if(name==='activity_plans'){
   if(req.method()==='GET')assert.equal(url.searchParams.get('user_id'),'eq.'+uid);else assert.equal(JSON.parse(req.postData()).user_id,uid);
   if(req.method()==='POST'){
    if(failSave){code=500;data={message:'fixture archive failed'};}
    else {saved={...JSON.parse(req.postData()),id:archive,created_at:new Date().toISOString()};data={id:archive};}
   }else {if(url.searchParams.has('id'))assert.equal(url.searchParams.get('id'),'eq.'+archive);data=saved?[saved]:[];}
  }
  else if(name==='append_activity_note'){assert(saved,'archive exists before append');notes.push(JSON.parse(req.postData()));data=null;}
  else if(name==='family_profiles')data=[{parent_name:'Fixture Parent',marketing_opt_in:false}];
  else if(name==='product_access')data=[{product_key:'activity-generator',revoked_at:null}];
  else if(name==='read_planner_records')data=notes.length?[{day:notes[0].p_day,calendar_note:'',family_note:notes[0].p_note,revision:1,children:[]}]:[];
  else throw new Error('Unmocked backend request '+url.pathname);
  await route.fulfill({status:code,contentType:'application/json',body:JSON.stringify(data)});
 });
 await ctx.route('**/api/activity',route=>{
  const request=JSON.parse(route.request().postData());
  if(request.action==='trips'){
   const body=tripMode==='timeout'?{code:'trip_search_timeout',error:'The field-trip search timed out before it finished. Your search settings are still here; please try again.'}:tripMode==='empty'?{status:'no_matches',trips:[],message:`I couldn’t verify any good field-trip options for this topic within ${request.trip.radius} miles for your dates and budget. Try a larger radius, different dates or a different budget.`}:{status:'results',trips:[{title:'Sample Nature Center',summary:'Observe butterfly habitats.',supplies:['Notebook'],url:'https://nature.example/visit',evidence:'Official visitor information.',distanceMiles:20,estimatedCost:0}],message:'These options matched your search.'};
   return route.fulfill({status:tripMode==='timeout'?503:200,contentType:'application/json',body:JSON.stringify(body)});
  }
  return route.fulfill({contentType:'application/json',body:JSON.stringify(request.action==='ideas'?{ideas:[idea,{...idea,title:'Life-cycle observation'},{...idea,title:'Compare wing markings'}]}:{plan})});
 });
 const page=await ctx.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function openPlan(){
  await page.goto('http://127.0.0.1:3101/generators/activity');
  await page.getByRole('button',{name:'Plan an Activity',exact:true}).click();
  await page.getByRole('checkbox',{name:/Sample Child/}).check();
  await page.getByLabel('What are you studying?').fill('Butterflies');
  await page.getByRole('button',{name:'Discover activities',exact:false}).click();
  await page.getByRole('button',{name:'Check for field trip opportunities',exact:true}).click();
  await page.getByRole('heading',{name:'Field trip opportunities',exact:true}).waitFor();
  await page.getByRole('button',{name:'Show Me the Plan',exact:true}).first().click();
  await page.getByRole('heading',{name:'Activity Instructions',exact:true}).waitFor();
  await page.getByRole('heading',{name:idea.title,exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Give Me Three More',exact:true}).count(),0);
  assert.equal(await page.getByRole('heading',{name:'Field trip opportunities',exact:true}).count(),0);
  assert.equal(await page.getByLabel('Any direction for the next three? (optional)').count(),0);
  assert.equal(await page.getByRole('button',{name:'Revise this plan'}).count(),0);
  const focus=await page.evaluate(()=>({text:document.activeElement.textContent,y:document.activeElement.getBoundingClientRect().top}));assert.equal(focus.text,'Activity Instructions');assert(focus.y>=0&&focus.y<100);
 }
 return {ctx,page,openPlan,notes,errors,failArchive:()=>{failSave=true;},saved:()=>saved,setTripMode:mode=>{tripMode=mode;}};
}
(async()=>{
 const {spawn}=require('node:child_process');
 const server=spawn(process.execPath,[path.join(repository,'node_modules/next/dist/bin/next'),'start','--port','3101','--hostname','127.0.0.1'],{cwd:repository,stdio:['ignore','pipe','pipe']});
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('Ready'))resolve();});server.stderr.on('data',d=>process.stderr.write(d));server.once('exit',code=>reject(new Error('server exited '+code)));});
 const launchOptions={headless:true};if(process.env.TEACH_UI_CHROMIUM_EXECUTABLE)launchOptions.executablePath=process.env.TEACH_UI_CHROMIUM_EXECUTABLE;if(process.env.TEACH_UI_CHROMIUM_ARGS)launchOptions.args=JSON.parse(process.env.TEACH_UI_CHROMIUM_ARGS);
 const browser=await chromium.launch(launchOptions);
 try{
  const f=await fixture(browser,'active');await f.openPlan();
  await f.page.getByRole('button',{name:'Add to Planner',exact:true}).click();
  await f.page.getByLabel('Very brief overview').waitFor();
  assert(f.saved(),'Add to Planner auto-saved archive');
  await f.page.getByLabel('Planner date').fill('2026-11-07');
  await f.page.getByRole('button',{name:'Add to Planner',exact:true}).last().click();
  await f.page.getByRole('button',{name:'Added to Planner',exact:true}).waitFor();
  assert.equal(f.notes.length,1);assert(f.notes[0].p_note.includes('/generators/activity?plan='+archive));assert(f.notes[0].p_note.length<400);assert(!f.notes[0].p_note.includes('Ruler'));
  await f.page.emulateMedia({media:'print'});assert.equal(await f.page.getByRole('heading',{name:idea.title}).isVisible(),true);assert.equal(await f.page.getByRole('button',{name:'Print',exact:true}).isVisible(),false);await f.page.emulateMedia({media:'screen'});
  await f.page.getByRole('button',{name:'Back to ideas',exact:true}).click();await f.page.getByRole('button',{name:'Give Me Three More',exact:true}).waitFor();
  await f.page.goto('http://127.0.0.1:3101/planner/workspace');await f.page.getByLabel('Record for', {exact:true}).fill('2026-11-07');
  const link=f.page.getByRole('link',{name:'Open saved activity',exact:false});await link.waitFor();assert.equal(await link.getAttribute('href'),'/generators/activity?plan='+archive);
  await f.page.goto('http://127.0.0.1:3101'+await link.getAttribute('href'));await f.page.getByRole('heading',{name:idea.title,exact:true}).waitFor();
  assert.deepEqual(f.errors,[]);console.log('PASS desktop: clean plan, focus/scroll, auto-archive, short linked Planner note, archive reopen, print title, Back to Ideas');await f.ctx.close();
  const m=await fixture(browser,'none',390);await m.openPlan();await m.page.getByRole('link',{name:'Get the TEACH Planner — $5.99/year',exact:true}).waitFor();if(process.env.TEACH_UI_SCREENSHOT_PATH)await m.page.screenshot({path:process.env.TEACH_UI_SCREENSHOT_PATH,fullPage:true});assert.equal(await m.page.getByRole('button',{name:'Add to Planner',exact:true}).count(),0);assert.deepEqual(m.errors,[]);console.log('PASS mobile: clean plan, heading visible, purchase prompt without add access');await m.ctx.close();
  const e=await fixture(browser,'error');await e.openPlan();await e.page.getByRole('button',{name:'Check again',exact:true}).waitFor();assert.equal(await e.page.getByRole('link',{name:'Get the TEACH Planner — $5.99/year',exact:true}).count(),0);console.log('PASS failed subscription check: retry rather than false purchase prompt');await e.ctx.close();
  const a=await fixture(browser,'active');await a.openPlan();a.failArchive();await a.page.getByRole('button',{name:'Add to Planner',exact:true}).click();await a.page.getByText('We couldn’t save your plan. Please try again.',{exact:true}).waitFor();assert.equal(a.notes.length,0);assert.equal(await a.page.getByLabel('Very brief overview').count(),0);console.log('PASS archive failure: no unlinked Planner note is created');await a.ctx.close();
  const t=await fixture(browser,'none',390);await t.openPlan();await t.page.getByRole('button',{name:'Back to ideas',exact:true}).click();
  await t.page.getByLabel('Starting town, state or ZIP code').fill('Sample Town, KY');await t.page.getByLabel('From',{exact:true}).fill('2026-11-07');await t.page.getByLabel('Through',{exact:true}).fill('2026-11-07');
  await t.page.getByRole('button',{name:'Search this area',exact:true}).click();await t.page.getByRole('heading',{name:'Sample Nature Center',exact:true}).waitFor();
  t.setTripMode('timeout');await t.page.getByLabel('Radius in miles').fill('75');await t.page.getByRole('button',{name:'Search this area',exact:true}).click();await t.page.getByText('The field-trip search timed out before it finished. Your search settings are still here; please try again.',{exact:true}).waitFor();
  assert.equal(await t.page.getByRole('heading',{name:'Sample Nature Center',exact:true}).count(),0);assert.equal(await t.page.getByLabel('Radius in miles').inputValue(),'75');assert.equal(await t.page.getByLabel('Starting town, state or ZIP code').inputValue(),'Sample Town, KY');
  t.setTripMode('empty');await t.page.getByRole('button',{name:'Search this area',exact:true}).click();await t.page.getByText(/I couldn’t verify any good field-trip options for this topic within 75 miles/).waitFor();assert.equal(await t.page.getByLabel('From',{exact:true}).inputValue(),'2026-11-07');assert.deepEqual(t.errors,[]);console.log('PASS field-trip UI: distinct results, timeout and no-match outcomes; retained criteria; no stale destinations');await t.ctx.close();
 }finally{await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
