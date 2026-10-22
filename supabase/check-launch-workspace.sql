begin;
insert into auth.users(id,email,aud,role) values ('11111111-1111-4111-8111-111111111111','launch-a@example.invalid','authenticated','authenticated'),('22222222-2222-4222-8222-222222222222','launch-b@example.invalid','authenticated','authenticated');
insert into public.family_profiles(user_id,parent_name) values('11111111-1111-4111-8111-111111111111','Fixture family A'),('22222222-2222-4222-8222-222222222222','Fixture family B');
insert into public.family_children(id,user_id,name) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','Fixture A'),('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','Fixture B');
insert into public.planner_subscriptions(user_id,starts_at,ends_at) values('11111111-1111-4111-8111-111111111111',now()-interval '1 day',now()+interval '1 day');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ declare revision bigint;begin
 revision:=public.save_planner_day('2026-10-22',0,repeat('Long calendar ',3000),'Family note','[{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","schooled":true,"note":"Child note"}]');
 if revision<>1 then raise exception 'First revision failed';end if;
 if length((select calendar_note from public.planner_days where day='2026-10-22'))<30000 then raise exception 'Long note truncated';end if;
 if not(select schooled from public.planner_child_days where day='2026-10-22') then raise exception 'Attendance not saved';end if;
 begin perform public.save_planner_day('2026-10-22',0,'stale','stale','[]');raise exception 'Stale write allowed';exception when raise_exception then if sqlerrm not like 'PLANNER_CONFLICT:%' then raise;end if;end;
 begin perform public.save_planner_day('2026-10-22',1,'Must roll back','Must roll back','[{"id":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb","schooled":true}]');raise exception 'Other child allowed';exception when raise_exception then if sqlerrm not like 'This child is not active%' then raise;end if;end;
 if (select d.revision from public.planner_days d where day='2026-10-22')<>1 then raise exception 'Partial day update survived';end if;
 revision:=public.save_planner_day('2026-10-22',1,'Saved again','Notes','[{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","schooled":false,"note":"Updated"}]');
 if revision<>2 then raise exception 'Revision increment failed';end if;
 if (select count(*) from public.read_planner_records(null,1000))<>1 then raise exception 'Archive pagination missing day';end if;
 if (select children->0->>'note' from public.read_planner_records(null,1000))<>'Updated' then raise exception 'Consistent child read failed';end if;
 begin insert into public.product_access(user_id,product_key) values(auth.uid(),'blueprint');raise exception 'Self entitlement allowed';exception when insufficient_privilege then null;end;
 insert into public.family_wishes(user_id,wish) values(auth.uid(),'Fixture wish');
end $$;
reset role;
update public.planner_subscriptions set ends_at=now()-interval '1 hour',starts_at=now()-interval '2 days' where user_id='11111111-1111-4111-8111-111111111111';
set local role authenticated;
do $$ begin
 if (select count(*) from public.planner_days)<>1 then raise exception 'Expired archive lost';end if;
 begin perform public.save_planner_day('2026-10-22',2,'Denied','Denied','[]');raise exception 'Expired edit allowed';exception when raise_exception then if sqlerrm not like 'Your Planner is read-only%' then raise;end if;end;
end $$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if exists(select 1 from public.planner_days) or exists(select 1 from public.planner_child_days) or exists(select 1 from public.family_wishes) then raise exception 'Other family data exposed';end if;
 begin perform public.save_planner_day('2026-10-22',0,'Denied','Denied','[]');raise exception 'Nonbuyer edit allowed';exception when raise_exception then if sqlerrm not like 'Your Planner is read-only%' then raise;end if;end;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform public.save_planner_day('2026-10-22',0,'Denied','Denied','[]');raise exception 'Anonymous edit allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
select 'PASS: long notes, atomic attendance/notes, revision conflict, other-child rollback, expired read-only, nonbuyer/anonymous denial, family isolation, trusted entitlements' as result;
rollback;
