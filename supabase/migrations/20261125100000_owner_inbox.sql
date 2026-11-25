begin;

create table if not exists public.teach_support_replies (
  message_id uuid primary key references public.family_support_messages(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 6000),
  state text not null check (state in ('sending', 'sent')),
  created_at timestamptz not null default now()
);

alter table public.teach_support_replies enable row level security;
revoke all on public.teach_support_replies from anon, authenticated;
grant select, insert, update, delete on public.teach_support_replies to authenticated;
drop policy if exists owner_support_replies on public.teach_support_replies;
create policy owner_support_replies on public.teach_support_replies for all to authenticated
  using (exists (select 1 from public.teach_administrators where user_id = (select auth.uid())))
  with check (exists (select 1 from public.teach_administrators where user_id = (select auth.uid())));

create or replace view public.teach_owner_inbox
with (security_invoker = true) as
select t.id, 'ask-jana'::text as source, t.title as subject, t.body,
       t.author_name::text as sender, coalesce(r.created_at, t.created_at) as activity_at,
       not coalesce(r.author_staff, t.author_staff) as needs_reply
from public.porch_threads t
left join lateral (
  select created_at, author_staff from public.porch_replies
  where thread_id = t.id and not hidden
  order by created_at desc, id desc limit 1
) r on true
where t.channel = 'ask-jana' and not t.hidden
  and exists (select 1 from public.teach_administrators where user_id = (select auth.uid()))
union all
select m.id, 'contact'::text, m.subject, m.message, m.reply_email::text,
       m.created_at, coalesce(r.state <> 'sent', true)
from public.family_support_messages m
left join public.teach_support_replies r on r.message_id = m.id
where exists (select 1 from public.teach_administrators where user_id = (select auth.uid()));

revoke all on public.teach_owner_inbox from public, anon, authenticated;
grant select on public.teach_owner_inbox to authenticated;

commit;
