-- Read each day's parent and child entries from one database snapshot.
create function public.read_planner_records(p_after date default null,p_limit integer default 1000)
returns table(day date,calendar_note text,family_note text,revision bigint,children jsonb)
language sql stable security invoker set search_path='' as $$
 with dates as (
  select d.day from public.planner_days d where d.user_id=(select auth.uid())
  union select c.day from public.planner_child_days c where c.user_id=(select auth.uid())
 ), page as (select dates.day from dates where p_after is null or dates.day>p_after order by dates.day limit greatest(1,least(coalesce(p_limit,1000),1000)))
 select page.day,coalesce(d.calendar_note,''),coalesce(d.family_note,''),coalesce(d.revision,0),
 coalesce((select jsonb_agg(jsonb_build_object('child_id',c.child_id,'schooled',c.schooled,'note',c.note) order by c.child_id) from public.planner_child_days c where c.user_id=(select auth.uid()) and c.day=page.day),'[]'::jsonb)
 from page left join public.planner_days d on d.user_id=(select auth.uid()) and d.day=page.day order by page.day;
$$;
revoke all on function public.read_planner_records(date,integer) from public,anon,authenticated;
grant execute on function public.read_planner_records(date,integer) to authenticated;
