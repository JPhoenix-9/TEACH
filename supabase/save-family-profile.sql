-- A family profile and its child edits commit together or not at all.
create function public.save_family_profile(p_parent_name text,p_phone text,p_marketing_opt_in boolean,p_children jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
declare child jsonb; owner_id uuid := auth.uid();
begin
 if owner_id is null then raise exception 'Please log in again'; end if;
 if jsonb_typeof(p_children) is distinct from 'array' then raise exception 'Invalid child list'; end if;
 insert into public.family_profiles(user_id,parent_name,phone,child_count,marketing_opt_in)
 values(owner_id,trim(p_parent_name),coalesce(trim(p_phone),''),
 (select count(*) from jsonb_array_elements(p_children) c where c->>'archived_at' is null),coalesce(p_marketing_opt_in,false))
 on conflict(user_id) do update set parent_name=excluded.parent_name,phone=excluded.phone,
 child_count=excluded.child_count,marketing_opt_in=excluded.marketing_opt_in;
 for child in select value from jsonb_array_elements(p_children) loop
  insert into public.family_children(id,user_id,name,age_years,grade_level,archived_at)
  values((child->>'id')::uuid,owner_id,trim(child->>'name'),(child->>'age_years')::smallint,
  coalesce(trim(child->>'grade_level'),''),(child->>'archived_at')::timestamptz)
  on conflict(id) do update set name=excluded.name,age_years=excluded.age_years,
  grade_level=excluded.grade_level,archived_at=excluded.archived_at;
 end loop;
end;
$$;
revoke all on function public.save_family_profile(text,text,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.save_family_profile(text,text,boolean,jsonb) to authenticated;
