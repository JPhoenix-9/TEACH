begin;
insert into auth.users(id,email,aud,role) values
 ('11111111-1111-4111-8111-111111111111','profile-a@example.invalid','authenticated','authenticated'),
 ('22222222-2222-4222-8222-222222222222','profile-b@example.invalid','authenticated','authenticated');
insert into public.family_profiles(user_id,parent_name) values
 ('11111111-1111-4111-8111-111111111111','Before'),
 ('22222222-2222-4222-8222-222222222222','Other parent');
insert into public.family_children(id,user_id,name) values
 ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-222222222222','Other child');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 begin
  perform public.save_family_profile('Must roll back','',true,
   '[{"id":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb","name":"Not mine","age_years":8,"grade_level":"3"}]');
  raise exception 'Other child was overwritten';
 exception when insufficient_privilege then null; end;
 if (select parent_name from public.family_profiles) <> 'Before' then raise exception 'Partial update survived'; end if;
 perform public.save_family_profile('Saved parent','',false,
   '[{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","name":"Own child","age_years":7,"grade_level":"2"}]');
 if (select child_count from public.family_profiles) <> 1 then raise exception 'Child count failed'; end if;
 if (select marketing_opt_in from public.family_profiles) then raise exception 'Opt-in default failed'; end if;
 if (select age_years from public.family_children) <> 7 then raise exception 'Child age failed'; end if;
 perform public.save_family_profile('Saved parent','',true,
   '[{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","name":"Own child","age_years":7,"grade_level":"2","archived_at":"2026-10-22T12:00:00Z"}]');
 if (select child_count from public.family_profiles) <> 0 then raise exception 'Archived count failed'; end if;
 if not (select marketing_opt_in from public.family_profiles) then raise exception 'Opt-in update failed'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform public.save_family_profile('Anonymous','',false,'[]');
 raise exception 'Anonymous profile save allowed';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'PASS atomic save, cross-family denial, child ages/count, consent choice, archive and anonymous denial' as result;
rollback;
