begin;
insert into auth.users(id,email,aud,role) values
('11111111-1111-4111-8111-111111111111','blueprint-import-a@example.invalid','authenticated','authenticated'),
('22222222-2222-4222-8222-222222222222','blueprint-import-b@example.invalid','authenticated','authenticated');
insert into public.family_profiles(user_id,parent_name) values
('11111111-1111-4111-8111-111111111111','Blueprint Fixture A'),
('22222222-2222-4222-8222-222222222222','Blueprint Fixture B');
insert into public.product_access(user_id,product_key) values
('11111111-1111-4111-8111-111111111111','blueprint'),
('22222222-2222-4222-8222-222222222222','gap-k2');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>45 then raise exception 'Blueprint purchaser cannot see all 45 entries';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>44 then raise exception 'Video count mismatch';end if;
 begin update public.teach_blueprint_lessons set published=false; raise exception 'Customer can edit lessons';exception when insufficient_privilege then null;end;
end $$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Other product grants Blueprint access';end if;end $$;
reset role;
delete from public.product_access where user_id='22222222-2222-4222-8222-222222222222';
insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-1');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>8 then raise exception 'Module 1 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 1 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-1') then raise exception 'Module 1 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 1 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-1';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 1 still grants access';end if;end $$;
reset role;

insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-2');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 2 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 2 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-2') then raise exception 'Module 2 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 2 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-2';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 2 still grants access';end if;end $$;
reset role;

insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-3');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>8 then raise exception 'Module 3 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>8 then raise exception 'Module 3 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-3') then raise exception 'Module 3 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 3 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-3';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 3 still grants access';end if;end $$;
reset role;

insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-4');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>8 then raise exception 'Module 4 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>8 then raise exception 'Module 4 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-4') then raise exception 'Module 4 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 4 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-4';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 4 still grants access';end if;end $$;
reset role;

insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-5');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 5 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 5 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-5') then raise exception 'Module 5 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 5 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-5';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 5 still grants access';end if;end $$;
reset role;

insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint-module-6');
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if (select count(*) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 6 entry count mismatch';end if;
 if (select count(video_url) from public.teach_blueprint_lessons)<>7 then raise exception 'Module 6 video count mismatch';end if;
 if exists(select 1 from public.teach_blueprint_lessons where module_key<>'blueprint-module-6') then raise exception 'Module 6 unlocked another module';end if;
 if (public.front_porch_access()->>'member')::boolean then raise exception 'Module 6 unexpectedly grants community membership';end if;
 begin insert into public.product_access(user_id,product_key) values('22222222-2222-4222-8222-222222222222','blueprint');raise exception 'Customer can grant purchase access';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='22222222-2222-4222-8222-222222222222' and product_key='blueprint-module-6';
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked module 6 still grants access';end if;end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','33333333-3333-4333-8333-333333333333',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Nonbuyer can see lessons';end if;end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='11111111-1111-4111-8111-111111111111';
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin if exists(select 1 from public.teach_blueprint_lessons) then raise exception 'Revoked buyer can see lessons';end if;end $$;
reset role;
insert into public.teach_administrators(user_id) values('22222222-2222-4222-8222-222222222222');
update public.teach_blueprint_lessons set published=false where source_step_id=(select source_step_id from public.teach_blueprint_lessons order by position limit 1);
set local role authenticated;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin if (select count(*) from public.teach_blueprint_lessons)<>45 then raise exception 'Administrator access failed';end if;end $$;
reset role;
set local role anon;
do $$ begin begin perform count(*) from public.teach_blueprint_lessons;raise exception 'Anonymous read allowed';exception when insufficient_privilege then null;end;end $$;
reset role;
select 'PASS: 45 entries / 44 videos; full buyer; all six isolated modules and revocations; community exclusion; purchase self-grant denial; nonbuyer; admin; anonymous; customer-write denial' as result;
rollback;
