-- Run against the TEACH project only. All fictional fixtures roll back.
begin;
insert into auth.users(id,email,aud,role) values
 ('11111111-1111-4111-8111-111111111111','planner-a@example.invalid','authenticated','authenticated'),
 ('22222222-2222-4222-8222-222222222222','planner-b@example.invalid','authenticated','authenticated');
insert into public.family_profiles(user_id,parent_name,child_count) values
 ('11111111-1111-4111-8111-111111111111','Sample A',1),
 ('22222222-2222-4222-8222-222222222222','Sample B',1);
insert into public.family_children(id,user_id,name) values
 ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','Sample child A'),
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','Sample child B');
insert into public.planner_subscriptions(user_id,starts_at,ends_at) values
 ('11111111-1111-4111-8111-111111111111',now()-interval '1 day',now()+interval '1 year'),
 ('22222222-2222-4222-8222-222222222222',now()-interval '2 years',now()-interval '1 year');
insert into public.planner_days(user_id,day,family_note) values
 ('22222222-2222-4222-8222-222222222222','2025-01-01','History remains available');
insert into public.planner_child_days(user_id,child_id,day,schooled,note) values
 ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','2025-01-01',true,'Archived child note');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ declare n integer; begin
 if (select count(*) from public.family_profiles) <> 1 then raise exception 'Profile privacy failed'; end if;
 if (select count(*) from public.family_children) <> 1 then raise exception 'Child privacy failed'; end if;
 if (select count(*) from public.planner_subscriptions) <> 1 then raise exception 'Subscription privacy failed'; end if;
 if exists(select 1 from public.planner_days) then raise exception 'Other family day leaked'; end if;
 if exists(select 1 from public.planner_child_days) then raise exception 'Other child day leaked'; end if;
 insert into public.planner_days(user_id,day,calendar_note) values
 ('11111111-1111-4111-8111-111111111111','2026-10-22',repeat('Long calendar note. ',2000));
 update public.planner_days set family_note='Updated' where day='2026-10-22';
 if (select revision from public.planner_days where day='2026-10-22') <> 2 then raise exception 'Revision failed'; end if;
 if (select length(calendar_note) from public.planner_days where day='2026-10-22') < 30000 then raise exception 'Long text lost'; end if;
 insert into public.planner_child_days(user_id,child_id,day,schooled,note) values
 ('11111111-1111-4111-8111-111111111111','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','2026-10-22',true,'Own child');
 update public.family_children set name='Must not change' where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
 get diagnostics n=row_count; if n <> 0 then raise exception 'Cross-family update allowed'; end if;
 begin
  insert into public.planner_days(user_id,day) values ('22222222-2222-4222-8222-222222222222','2026-10-22');
  raise exception 'Cross-family insert allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.planner_child_days(user_id,child_id,day) values
  ('11111111-1111-4111-8111-111111111111','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','2026-10-22');
  raise exception 'Cross-family child reference allowed';
 exception when foreign_key_violation then null; end;
 begin
  update public.planner_subscriptions set ends_at=now()+interval '10 years';
  raise exception 'Customer self-grant allowed';
 exception when insufficient_privilege then null; end;
 begin
  delete from public.planner_days;
  raise exception 'Archive deletion allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ declare n integer; begin
 if (select count(*) from public.planner_days) <> 1 then raise exception 'Expired history hidden or other family leaked'; end if;
 if (select count(*) from public.planner_child_days) <> 1 then raise exception 'Expired child history hidden'; end if;
 update public.planner_days set family_note='Not allowed' where day='2025-01-01';
 get diagnostics n=row_count; if n <> 0 then raise exception 'Expired update allowed'; end if;
 begin
  insert into public.planner_days(user_id,day) values ('22222222-2222-4222-8222-222222222222','2026-10-22');
  raise exception 'Expired entry allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.planner_child_days(user_id,child_id,day) values
  ('22222222-2222-4222-8222-222222222222','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','2026-10-22');
  raise exception 'Expired child entry allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.planner_subscriptions set ends_at=now()+interval '1 year'
where user_id='22222222-2222-4222-8222-222222222222';
set local role authenticated;
do $$ declare n integer; begin
 update public.planner_days set family_note='Renewal restores editing' where day='2025-01-01';
 get diagnostics n=row_count; if n <> 1 then raise exception 'Renewal failed'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform * from public.family_profiles; raise exception 'Anonymous profile read allowed';
 exception when insufficient_privilege then null; end;
 begin perform * from public.planner_days; raise exception 'Anonymous Planner read allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS: family isolation, active writes, long notes, revisions, protected subscriptions, expired read-only access, renewal and anonymous denial' as result;
rollback;
