import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';

test('GAP metadata and storage policies isolate grade bands, revocations and nonbuyers',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`
   create role authenticated;
   create schema auth;
   create schema storage;
   create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema auth,storage,public to authenticated;
   create table product_access(user_id uuid,product_key text,revoked_at timestamptz);
   create table teach_administrators(user_id uuid);
   create table webinar_registrations(user_id uuid,webinar_slug text);
   create table teach_webinars(slug text,ready boolean);
   create table teach_materials(product_key text,webinar_slug text,published boolean,storage_path text);
   create table storage.objects(bucket_id text,name text);
   alter table product_access enable row level security;
   alter table teach_materials enable row level security;
   alter table storage.objects enable row level security;
   grant select on product_access,teach_administrators,webinar_registrations,teach_webinars,teach_materials,storage.objects to authenticated;
   create policy product_access_read on product_access for select to authenticated using(user_id=(select auth.uid()));
   -- These predicates are the existing production material_read and teach_resource_read policies.
   create policy material_read on teach_materials for select to authenticated using(
    exists(select 1 from teach_administrators where user_id=(select auth.uid()))
    or (published and (
     (product_key is not null and exists(select 1 from product_access a where a.user_id=(select auth.uid()) and a.product_key=teach_materials.product_key and a.revoked_at is null))
     or (webinar_slug is not null and exists(select 1 from webinar_registrations r join teach_webinars w on w.slug=r.webinar_slug where r.user_id=(select auth.uid()) and r.webinar_slug=teach_materials.webinar_slug and w.ready))
    ))
   );
   create policy teach_resource_read on storage.objects for select to authenticated using(bucket_id='teach-resources' and exists(select 1 from teach_materials m where m.storage_path=objects.name));
   insert into teach_materials select key,null,true,'gap/'||key||'/curriculum.pdf' from unnest(array['gap-k2','gap-35','gap-68','gap-912']) key;
   insert into storage.objects select 'teach-resources',storage_path from teach_materials;
   insert into product_access values
    ('11111111-1111-4111-8111-111111111111','gap-k2',null),
    ('11111111-1111-4111-8111-111111111111','gap-35',now()),
    ('22222222-2222-4222-8222-222222222222','blueprint',null);
   set role authenticated;
  `);
  async function visible(user){
   await db.query("select set_config('request.jwt.claim.sub',$1,false)",[user]);
   const materials=await db.query('select product_key from teach_materials order by product_key');
   const objects=await db.query('select name from storage.objects order by name');
   return {keys:materials.rows.map(row=>row.product_key),paths:objects.rows.map(row=>row.name)};
  }
  assert.deepEqual(await visible('11111111-1111-4111-8111-111111111111'),{keys:['gap-k2'],paths:['gap/gap-k2/curriculum.pdf']});
  for(const user of ['22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333','']){
   assert.deepEqual(await visible(user),{keys:[],paths:[]});
  }
  await assert.rejects(db.exec("insert into product_access values('33333333-3333-4333-8333-333333333333','gap-912',null)"),/permission denied/);
 }finally{await db.close();}
});
