import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';

const sql=path=>readFileSync(new URL(path,import.meta.url),'utf8');

test('real Postgres RLS isolates every module, revocations, staff and nonbuyers',async()=>{
 const db=new PGlite();
 try {
  // Isolated Supabase-compatible auth/entitlement fixture, with the same SELECT
  // policies and community eligibility as the live project. No real users/media.
  await db.exec(`
   create role anon;
   create role authenticated;
   create role service_role;
   create schema auth;
   create schema private;
   create table auth.users(id uuid primary key,email text,aud text,role text);
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema auth,public,private to authenticated,anon;
   grant execute on function auth.uid() to authenticated,anon;
   create table public.family_profiles(user_id uuid primary key references auth.users(id),parent_name text);
   create table public.product_access(user_id uuid references public.family_profiles(user_id),product_key text,granted_at timestamptz default now(),revoked_at timestamptz,primary key(user_id,product_key),constraint product_access_product_key_check check(product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912','activity-generator')));
   alter table public.product_access enable row level security;
   grant select on public.product_access to authenticated;
   create policy product_access_read on public.product_access for select to authenticated using (user_id=(select auth.uid()));
   create table public.teach_administrators(user_id uuid primary key references auth.users(id));
   alter table public.teach_administrators enable row level security;
   grant select on public.teach_administrators to authenticated;
   create policy administrator_self_read on public.teach_administrators for select to authenticated using (user_id=(select auth.uid()));
   create function private.porch_staff() returns boolean language sql stable security definer set search_path='' as $$ select auth.uid() is not null and exists(select 1 from public.teach_administrators where user_id=auth.uid()) $$;
   create function private.porch_member() returns boolean language sql stable security definer set search_path='' as $$ select auth.uid() is not null and (private.porch_staff() or exists(select 1 from public.product_access where user_id=auth.uid() and revoked_at is null and product_key in ('blueprint','gap-k2','gap-35','gap-68','gap-912'))) $$;
   create function public.front_porch_access() returns jsonb language sql stable set search_path='' as $$ select jsonb_build_object('member',private.porch_member()) $$;
  `);
  // Execute the actual tracked course schema and the same migration applied live.
  await db.exec(sql('../supabase/blueprint-course-import.sql'));
  await db.exec(sql('../supabase/blueprint-individual-module-access.sql'));
  await db.exec(`
   insert into public.teach_blueprint_lessons(source_step_id,source_section_id,module_title,module_position,title,position,video_url,original_content,published)
   select ('00000000-0000-4000-8000-'||lpad((m*100+n)::text,12,'0'))::uuid,('00000000-0000-4000-8001-'||lpad(m::text,12,'0'))::uuid,'Module '||m,m*10,'Lesson '||n,n,
    case when m=1 and n=1 then null else 'https://video.wixstatic.com/video/fixture/720p/mp4/file.mp4' end,'{}'::jsonb,true
   from generate_series(1,6)m cross join lateral generate_series(1,case when m in (1,3,4) then 8 else 7 end)n;
  `);
  const results=await db.exec(sql('../supabase/check-blueprint-course.sql'));
  assert(results.some(result=>result.rows?.some(row=>String(row.result||'').startsWith('PASS:'))));
  assert.equal((await db.query('select count(*)::int as count from auth.users')).rows[0].count,0,'All test users rolled back');
 } finally { await db.close(); }
});
