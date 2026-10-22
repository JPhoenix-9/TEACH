begin;
insert into auth.users(id,email,aud,role) values ('11111111-1111-4111-8111-111111111111','content-a@example.invalid','authenticated','authenticated'),('22222222-2222-4222-8222-222222222222','content-b@example.invalid','authenticated','authenticated');
insert into public.family_profiles(user_id,parent_name) values('11111111-1111-4111-8111-111111111111','Fixture A'),('22222222-2222-4222-8222-222222222222','Fixture B');
insert into public.product_access(user_id,product_key) values('11111111-1111-4111-8111-111111111111','blueprint');
insert into public.teach_materials(product_key,title,storage_path,kind,published) values('blueprint','Fixture course','test-fixture/course.mp4','video',true),('gap-k2','Other purchase','test-fixture/gap.zip','document',true),('blueprint','Unpublished','test-fixture/hidden.pdf','document',false);
insert into public.teach_materials(webinar_slug,title,storage_path,kind,published) values('5-shifts','Fixture webinar','test-fixture/webinar.mp4','video',true);
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 if (select count(*) from public.teach_materials)<>1 then raise exception 'Product material visibility failed';end if;
 begin insert into public.teach_administrators(user_id) values(auth.uid());raise exception 'Admin self grant allowed';exception when insufficient_privilege then null;end;
 begin perform public.register_teach_webinar('5-shifts','Fixture',true);raise exception 'Unreleased registration allowed';exception when raise_exception then if sqlerrm not like 'This webinar is not open%' then raise;end if;end;
end $$;
reset role;
update public.teach_webinars set ready=true where slug='5-shifts';
set local role authenticated;
select public.register_teach_webinar('5-shifts','Fixture',true);
do $$ begin
 if (select count(*) from public.teach_materials)<>2 then raise exception 'Registered material missing';end if;
 if not(select marketing_opt_in from public.family_profiles) then raise exception 'Explicit email choice not recorded';end if;
 if (select consent_version from public.webinar_registrations)<>'teach-webinar-2026-10-22' then raise exception 'Consent version missing';end if;
end $$;
select set_config('request.jwt.claim.sub','22222222-2222-4222-8222-222222222222',true);
do $$ begin
 if exists(select 1 from public.teach_materials) or exists(select 1 from public.webinar_registrations) then raise exception 'Other user material exposed';end if;
 begin perform public.register_teach_webinar('5-shifts','Fixture',false);raise exception 'Registration without permission allowed';exception when raise_exception then if sqlerrm not like 'Please log in and confirm%' then raise;end if;end;
 insert into public.family_support_messages(user_id,subject,message) values(auth.uid(),'Fixture subject','Fixture message');
 begin insert into public.family_support_messages(user_id,subject,message,reply_email) values(auth.uid(),'Fixture','Fixture','someone-else@example.invalid');raise exception 'Spoofed reply accepted';exception when check_violation then null;end;
end $$;
reset role;
insert into public.teach_administrators(user_id) values('11111111-1111-4111-8111-111111111111');
set local role authenticated;
select set_config('request.jwt.claim.sub','11111111-1111-4111-8111-111111111111',true);
do $$ begin
 if (select count(*) from public.family_support_messages)<>1 then raise exception 'Admin support view missing';end if;
 if (select count(*) from public.teach_materials)<>4 then raise exception 'Admin content view missing';end if;
end $$;
reset role;
update public.product_access set revoked_at=now() where user_id='11111111-1111-4111-8111-111111111111';
-- Tests leave no administrators, registrations, messages, files or release changes behind.
select 'PASS: product isolation, unpublished protection, consent, registration gates, administrator assignment denial, private support and admin read' as result;
rollback;
