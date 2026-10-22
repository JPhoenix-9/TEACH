# October 22 launch implementation batch

## Authorized scope
The owner asked to proceed with all remaining launch work except Stripe/payments, missing recordings or deliverable files only she can provide, and Front Porch operational decisions. Generators are explicitly excluded from initial launch and remain Coming Soon. Do not connect the production domain while checkout and essential migration are incomplete.

## Implemented in this batch
- Layered My Desk room with independent, keyboard-accessible tool links. New sibling room background and isolated desk tool assets leave the approved homepage and locked header unchanged. No standalone printer. Monitor left, lamp and discreet mug right. Physical folder control opens Children’s Records. Signed-in family name is real; no invented learning progress or purchases.
- `/planner/workspace` loads the real family's shared child profiles and archive. `/planner/preview` remains separate fictional sample data. Debounced account saving shows status, prevents navigation without warning while unsaved, preserves drafts after failed writes, and detects concurrent edits using per-day revisions. Save is one transaction for the calendar/family/child entries.
- Archive reads combine each date's parent and child entries in one database snapshot, with keyset pagination rather than a silent 1,000-row ceiling. Archived child history stays available for reports.
- `/records` uses the same economical attendance/notes report component and Word export as the Planner; all three report modes, whole family or one child, required date ranges and copyright on every page are preserved. No raw data download.
- Paid editing still requires a trusted active Planner subscription; this batch does not grant free access or configure billing. Expired accounts retain read/export access. Product permissions are distinct from Planner and free accounts.
- Product resource pages, webinar viewer and a private storage bucket are prepared. Short-lived signed links require database/storage permissions. Course files and recordings remain unavailable because they have not been supplied. No invented modules or downloadable packages.
- Webinar registration infrastructure captures explicit permission wording, version and timestamp; a release flag prevents registration/viewing before the recording is ready. Existing live webinar registration stays on Homeschool-911 during migration. The unreleased webinar is not released by this batch.
- Private Wishing Well and support-message forms save authenticated submissions. No outgoing messages or campaigns were sent. Inbound support email still has not been verified.
- Administrator role and read-only admin overview are implemented. Administrator assignment cannot be self-granted. The owner’s existing confirmed invitation account was assigned using a guarded trusted database operation only after verifying that it is the project’s sole account. No browser signup can assign this role. No private family information is exposed in public pages.
- Public site search works without editing the locked Header component. Added factual Privacy and Using TEACH pages, collection-point links, footer links, sitemap, robots and conservative response headers. These do not invent final checkout/refund/cancellation terms, nor claim a completed legal review.

## Verification
- Production build and browser checks are recorded below after completion.
- `check-launch-workspace.sql`: rolled-back fixture tests passed for long notes, atomic day saving, stale revision rejection, cross-family child rollback, expired read-only history, nonbuyer/anonymous denial and product access self-grant denial.
- `check-content-delivery.sql`: rolled-back fixtures passed for product isolation, unpublished material protection, unreleased webinar denial, permission capture, admin self-grant denial, private support and administrator read access.
- Security advisor reports only the pre-existing disabled leaked-password protection warning; no new RLS exposure findings.

## Still blocked or intentionally held
- Stripe integration, final Planner pricing/renewal checkout and actual paid fulfillment tests.
- Recording/package delivery content and complete Wix media inventory/evacuation. Keep Wix until its dependencies are preserved.
- Front Porch operational decisions and launch; no private community is exposed.
- Real-device signed-in acceptance testing, production domain cutover after launch blockers close.
- Brevo marketing-list automation and replies need separate operational setup; account SMTP is working, but no marketing campaigns were created or sent.
- Restore/backup operations beyond family PDF/Word copies need a documented database operations plan. Free-plan backup availability is not assumed.

Live deployment verified. Browser search found Planner and Children’s Records for attendance, and the header Enter action found the Patience article. Local development preview did not hydrate reliably; production hydration worked, so interactive verification uses the deployed site.

Owner approval: the owner called the new desk room image terrific on October 22. Preserve this approved room background; further work is functional. A trusted one-year nonbilling Planner test seat was added only to the sole verified owner/admin account so she can test saving without Stripe. This is not a customer purchase, checkout or general free access.
Phone-width QA: the desk main area fits a 375px content width without horizontal overflow. The existing locked Header tagline clips at that width; its design was not changed. Real phone acceptance and any specifically authorized Header responsiveness adjustment remain pending.
