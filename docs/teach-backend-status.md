# TEACH backend status — October 22 2026

Organization: TEACH (`bqdtubfcocansgizcieg`). Project: Teach website (`jhooodlcvcpnzcpreqmu`), region us-west-2, standard Postgres 17, healthy when inspected. This is separate from Chef Jay. No Chef Jay project changes were made.

The owner created the Free organization/project, saved the database password, enabled Data API and automatic RLS, and disabled automatically exposing new tables. The Supabase connection was reauthorized to TEACH. No database password or secret API key is stored in the repository.

## Completed database foundation

Applied remote migration `20261022182014_teach_private_planner_storage`. Its source is `supabase/planner-storage.sql`.

- `family_profiles`: one parent-owned family profile; parent name, optional phone, child count and a separate marketing opt-in defaulting to false. Authentication owns the email address. Actual consent wording and evidence capture still belong in the account signup implementation.
- `family_children`: shared parent-owned child profiles with name, age and grade. Archiving a child does not delete historical records.
- `planner_subscriptions`: trusted server-managed start/end/revocation information, separate from community eligibility. Customers cannot grant or extend their own access. This does not configure billing or Stripe.
- `planner_days`: calendar text and family notes, indexed by family/date, with no character limit tied to the calendar square.
- `planner_child_days`: attendance and individual notes, linked to a child in the same family through a composite foreign key.
- All five tables use RLS and explicit least-privilege grants. Anonymous roles have no access. Read policies preserve historical access after expiry. Write policies require current trusted Planner access. No customer delete grants are provided; edits can clear notes or uncheck attendance. Account erasure and recovery require a separately designed administrative process.
- Revision counters and timestamps support future conflict detection. The client still needs to use the revision in conditional updates and show save/conflict states; these database columns alone do not solve concurrent editing.
- Revoked browser execution of the dashboard-installed `public.rls_auto_enable()` event-trigger function. The automatic RLS trigger remains installed.

## Verification

`supabase/check-planner-storage.sql` uses fictional fixtures in one transaction and ends in ROLLBACK. Verified family isolation, active writes, a long calendar entry, revision increment, forbidden cross-family references, forbidden self-granted subscriptions, no customer record deletion, expired read-only access, restored editing after renewal, and anonymous denial. Confirmed zero authentication users, family profiles and saved days remain after testing.

Supabase security advisor returned no findings. Performance advisor only reported an unused index on this empty database; no traffic-based optimization is justified yet.

## Not connected yet

The website still has Coming Soon account/login pages and a fictional session-only Planner preview. Database setup does not change that behavior. No customer records are being saved from the website yet.

Still needed: actual signup and sign-in, verification/reset email configuration, family profile screens, authenticated Planner loading/saving with conflict/error handling, subscription integration, authenticated cross-device browser tests, and an operational backup/recovery plan. Free project creation alone does not supply the tested permanent archive promise. Full-record printing through Files remains future scope.
