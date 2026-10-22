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

## Account and email integration October 22 2026

Owner authenticated and branded teachforlove.com through Brevo/GoDaddy, created sender TEACH <support@teachforlove.com>, generated a TEACH Supabase SMTP key and saved it in Supabase. A test invitation reached Gmail spam; Gmail Show original reported SPF, DKIM and DMARC PASS. Delivery to inbox is not guaranteed. An inbound support mailbox has not been demonstrated. The key/password remain outside this repository.

Owner set Site URL to https://teach-mocha.vercel.app and allowed the exact https://teach-mocha.vercel.app/auth/callback redirect. TeachForLove.com is not yet the live website destination.

Account UI now implements email signup, password login, reset requests, confirmation/recovery/invitation callbacks, logout and editable private parent/child profiles. Uses pinned supabase-js 2.118.0 and only the public publishable key. Auth uses browser sessions; database RLS enforces ownership. Dashboard invitation tokens reaching Site URL are forwarded to the callback without rendering tokens. Email link errors offer fresh reset/login links. No third-party tracking is added to the callback.

Profile saves use the security-invoker save_family_profile RPC so parent and child updates commit atomically, with ownership enforced by RLS. An independent rolled-back SQL test verified privacy, atomic rollback, child ages/count, separate marketing choice and archiving. No fictional test accounts remain. No entitlement is granted on signup.

The public account and callback screens have been built; real email-link completion and cross-device user acceptance still need testing with the owner. Planner saving is not yet connected to these accounts. Stripe, historical purchase recognition and backup/recovery operations remain pending. Supabase's security advisor reports leaked-password checking is disabled; it did not report a table/RLS issue in this batch.
