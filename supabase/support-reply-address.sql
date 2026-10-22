-- Reply information comes from the signed-in account, not a typed destination.
alter table public.family_support_messages add column reply_email text not null default coalesce(auth.jwt()->>'email','');
alter table public.family_support_messages add constraint support_reply_matches_account check(reply_email=coalesce(auth.jwt()->>'email','') or current_user not in('authenticated','anon'));
