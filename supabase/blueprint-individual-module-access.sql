alter table public.product_access drop constraint product_access_product_key_check;
alter table public.product_access add constraint product_access_product_key_check check (
 product_key in ('blueprint','blueprint-module-1','blueprint-module-2','blueprint-module-3','blueprint-module-4','blueprint-module-5','blueprint-module-6','gap-k2','gap-35','gap-68','gap-912','activity-generator')
);
alter table public.teach_blueprint_lessons add column module_key text generated always as ('blueprint-module-' || (module_position / 10)::text) stored;
alter table public.teach_blueprint_lessons add constraint blueprint_module_position_check check (module_position in (10,20,30,40,50,60));
drop policy blueprint_lesson_read on public.teach_blueprint_lessons;
create policy blueprint_lesson_read on public.teach_blueprint_lessons for select to authenticated using (
 exists(select 1 from public.teach_administrators a where a.user_id=(select auth.uid()))
 or (published and exists(select 1 from public.product_access p where p.user_id=(select auth.uid()) and p.product_key in ('blueprint',teach_blueprint_lessons.module_key) and p.revoked_at is null))
);
comment on column public.teach_blueprint_lessons.module_key is 'Entitlement for this module only. Full blueprint entitlement grants all six. No community membership is inferred from an individual module.';
