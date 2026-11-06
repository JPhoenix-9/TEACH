import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

test('real SQL uses current purchase records and isolates Planner-only private conversations',async()=>{
 const db=new PGlite();
 const id=n=>`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
 try{
  await db.exec(`
   create role anon;create role authenticated;create schema auth;create schema private;
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,public,private to anon,authenticated;
   create table public.product_access(user_id uuid,product_key text,revoked_at timestamptz);
   create table public.transcript_licenses(user_id uuid,purchased_at timestamptz,expires_at timestamptz,revoked_at timestamptz);
   create table public.planner_subscriptions(user_id uuid,starts_at timestamptz,ends_at timestamptz,revoked_at timestamptz);
   create table public.teach_administrators(user_id uuid);
   create function private.porch_staff() returns boolean language sql stable security definer set search_path='' as $$select auth.uid() is not null and exists(select 1 from public.teach_administrators where user_id=auth.uid())$$;
   create function private.porch_member() returns boolean language sql stable security definer set search_path='' as $$select false$$;
   create function private.ask_jana_member() returns boolean language sql stable security definer set search_path='' as $$select false$$;
   create table public.porch_threads(id uuid primary key,user_id uuid,channel text,body text,hidden boolean default false);
   create table public.porch_replies(id uuid primary key,thread_id uuid references public.porch_threads(id),user_id uuid,body text,hidden boolean default false);
   create function private.porch_reply_member(p_thread_id uuid) returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.porch_threads t where t.id=p_thread_id and case when t.channel='ask-jana' then private.ask_jana_member() and (t.user_id=auth.uid() or private.porch_staff()) else private.porch_member() end)$$;
   alter table public.porch_threads enable row level security;alter table public.porch_replies enable row level security;
   grant select,insert,update on public.porch_threads,public.porch_replies to authenticated;
   create policy porch_threads_read on public.porch_threads for select to authenticated using ((not hidden or private.porch_staff()) and case when channel='ask-jana' then private.ask_jana_member() and(user_id=auth.uid() or private.porch_staff()) else private.porch_member() end);
   create policy porch_threads_write on public.porch_threads for insert to authenticated with check(user_id=auth.uid() and not hidden and case when channel='ask-jana' then private.ask_jana_member() else private.porch_member() end);
   create policy porch_threads_hide on public.porch_threads for update to authenticated using(private.porch_member() and (user_id=auth.uid() or private.porch_staff())) with check(private.porch_member() and (user_id=auth.uid() or private.porch_staff()));
   create policy porch_replies_read on public.porch_replies for select to authenticated using(private.porch_reply_member(thread_id) and (not hidden or private.porch_staff()));
   create policy porch_replies_write on public.porch_replies for insert to authenticated with check(private.porch_reply_member(thread_id) and user_id=auth.uid() and not hidden);
   create policy porch_replies_hide on public.porch_replies for update to authenticated using(private.porch_member() and (user_id=auth.uid() or private.porch_staff())) with check(private.porch_member() and (user_id=auth.uid() or private.porch_staff()));
   insert into public.product_access values('${id(1)}','activity-generator',null),('${id(4)}','blueprint-module-1',null),('${id(5)}','blueprint',null),('${id(8)}','activity-generator',now());
   insert into public.transcript_licenses values('${id(2)}',now()-interval '1 day',now()+interval '3 years',null),('${id(9)}',now()-interval '3 years',now()-interval '1 day',null),('${id(10)}',now()-interval '1 day',now()+interval '3 years',now()),('${id(11)}',now()+interval '1 day',now()+interval '3 years',null);
   insert into public.planner_subscriptions values('${id(3)}',now()-interval '1 day',now()+interval '1 year',null),('${id(6)}',now()-interval '2 years',now()-interval '1 day',null),('${id(7)}',now()-interval '1 day',now()+interval '1 year',now());
   insert into public.teach_administrators values('${id(12)}');
   insert into public.porch_threads values('${id(101)}','${id(3)}','ask-jana','Private Planner question',false),('${id(102)}','${id(5)}','support','Shared question',false),('${id(103)}','${id(5)}','ask-jana','Another family private question',false);
   insert into public.porch_replies values('${id(201)}','${id(101)}','${id(12)}','Private staff reply',false),('${id(202)}','${id(103)}','${id(12)}','Other family reply',false),('${id(203)}','${id(102)}','${id(1)}','Shared reply',false);
  `);
  const migration=readFileSync(new URL('../supabase/migrations/20261106193648_porch_purchase_permissions.sql',import.meta.url),'utf8');
  await db.exec(migration);
  for(const [n,member,ask] of [[1,true,true],[2,true,true],[3,false,true],[4,false,false],[5,true,true],[6,false,false],[7,false,false],[8,false,false],[9,false,false],[10,false,false],[11,false,false],[12,true,true],[13,false,false]]){
   await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(n)}',false);`);
   const {rows:[row]}=await db.query('select private.porch_member() as member,private.ask_jana_member() as ask');
   assert.deepEqual(row,{member,ask},`entitlement fixture ${n}`);await db.exec('reset role');
  }
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(3)}',false);`);
  assert.deepEqual((await db.query('select id from public.porch_threads order by id')).rows,[{id:id(101)}]);
  assert.deepEqual((await db.query('select id from public.porch_replies order by id')).rows,[{id:id(201)}]);
  await assert.rejects(db.exec(`insert into public.porch_threads(id,user_id,channel,body)values('${id(104)}','${id(3)}','support','Not allowed')`));
  await assert.rejects(db.exec(`insert into public.porch_replies(id,thread_id,user_id,body)values('${id(204)}','${id(103)}','${id(3)}','Not allowed')`));
  await db.exec(`insert into public.porch_threads(id,user_id,channel,body)values('${id(104)}','${id(3)}','ask-jana','Own private question');insert into public.porch_replies(id,thread_id,user_id,body)values('${id(204)}','${id(101)}','${id(3)}','Own reply');`);
  await assert.rejects(db.query(`select public.hide_own_porch_message('thread','${id(103)}')`));
  await assert.rejects(db.query(`select public.hide_own_porch_message('reply','${id(201)}')`));
  await assert.rejects(db.query(`select public.hide_own_porch_message('invalid','${id(104)}')`));
  await db.exec(`select public.hide_own_porch_message('reply','${id(204)}');select public.hide_own_porch_message('thread','${id(104)}');reset role;`);
  assert.equal((await db.query(`select hidden from public.porch_threads where id='${id(104)}'`)).rows[0].hidden,true);
  assert.equal((await db.query(`select hidden from public.porch_replies where id='${id(204)}'`)).rows[0].hidden,true);
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(3)}',false);update public.porch_threads set hidden=false where id='${id(104)}';reset role;`);
  assert.equal((await db.query(`select hidden from public.porch_threads where id='${id(104)}'`)).rows[0].hidden,true,'Owner cannot restore hidden content');
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(12)}',false);update public.porch_threads set hidden=false where id='${id(104)}';reset role;`);
  assert.equal((await db.query(`select hidden from public.porch_threads where id='${id(104)}'`)).rows[0].hidden,false,'Only staff can restore hidden content');
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(5)}',false);select public.hide_own_porch_message('thread','${id(102)}');update public.porch_threads set hidden=false where id='${id(102)}';reset role;`);
  assert.equal((await db.query(`select hidden from public.porch_threads where id='${id(102)}'`)).rows[0].hidden,true,'A full member also cannot undo hidden content');
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','${id(1)}',false);`);
  assert.equal((await db.query(`select id from public.porch_threads where id='${id(102)}'`)).rows.length,0,'Another member cannot see a removed shared thread');
  assert.equal((await db.query(`select id from public.porch_replies where thread_id='${id(102)}'`)).rows.length,0,'Replies cannot be retrieved through a known removed thread id');
  await db.exec('reset role;');
  await db.exec(`set role authenticated;select set_config('request.jwt.claim.sub','',false);`);
  assert.deepEqual((await db.query('select private.porch_member() as member,private.ask_jana_member() as ask')).rows[0],{member:false,ask:false});
  await db.exec('reset role;set role anon;');await assert.rejects(db.query('select private.ask_jana_member()'));await assert.rejects(db.query(`select public.hide_own_porch_message('thread','${id(104)}')`));await db.exec('reset role;');
 }finally{await db.close();}
});
