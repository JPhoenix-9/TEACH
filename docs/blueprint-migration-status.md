# Homeschool Success Blueprint import — November 4, 2026

Source: Homeschool-911 Wix Online Programs. Destination: existing TEACH Supabase project and `/resources`.

- Imported all 6 original module titles and their ordering, 45 step records and original content JSON into `public.teach_blueprint_lessons`.
- 44 records contain videos. The remaining record is the original Module 1 heading, preserved in the database; the viewer uses the module heading without adding an empty video lesson.
- Preserved original lesson titles and ordering. Each record retains its source step and section identifiers for reconciliation.
- All 44 media descriptors are READY. All 44 selected 720p video URLs returned HTTP 200 and video content type on November 4.
- Private lesson reads require the complete Blueprint entitlement, the exact selected module entitlement, or trusted TEACH administrator access. Six module keys are supported, with generated module keys derived from the original module ordering. Anonymous users cannot read the table; customers cannot write or grant themselves purchases. No customer entitlements or accounts were created by this release.
- The tracked SQL test runs in isolated Postgres (PGlite), applying the actual course schema and module-access migration. It covers the full course, all six isolated module purchases, every module revocation, community exclusion for module-only purchases, administrators, nonbuyers, anonymous reads, and customer purchase self-grant denial. The intended live fixture test required native confirmation and expired without running; it was replaced by this isolated test, not retried through a different live mutation path. Live read-only checks verified RLS and privileges, and a direct anonymous REST request returned HTTP 401 / permission denied. No fixture customers or purchases remain in production.
- `/resources` provides the purchased module list, a single video player and previous/next lesson controls. My Desk routes both full-course and individual-module buyers to their lessons. It fetches protected lesson data after authentication; no source media URLs or original course JSON are bundled into public repository content.

## Video hosting dependency

This imports course structure, content records and playback references. It does **not** copy the video binaries out of Wix. The originals total approximately 55.30 GB; the selected 720p versions total approximately 7.72 GB. Streaming still depends on the existing Wix media URLs. These URLs were already public at the source; purchaser gating on TEACH does not make the underlying Wix URLs private or prevent an authorized viewer sharing them.

Keep Wix and its media intact. A full independent video migration needs a selected storage/delivery destination and capacity. Do not cancel Wix on the strength of this import. Existing-purchase matching, billing and the domain cutover remain separate work.

## Sales page, pricing and enrollment

- The sales page embeds the original 3:35 Blueprint introduction extracted from the Wix `/hsb` page. Its exact video and poster returned HTTP 200; playback uses native controls, no autoplay, and no preload. The public sales video is intentionally separate from gated lesson records.
- The six original module titles and 44-video total are reflected on the sales page. Approved pricing is $29.99 for one module or $149.99 for the complete package. All six separately total $179.94; the package saves $29.95. Public catalog amounts are integer cents and selection uses an allowlisted product key, not a client-supplied price.
- Each module and the bundle link to an on-site selection summary. Existing access is recognized there. New enrollment explicitly remains unavailable; it does not send buyers to the old Wix shop or pretend a payment completed. TEACH live Stripe is not exposed by the current connector, and its dashboard account was reported restricted. Checkout/payment fulfillment is the next separate step.
- Module-only Front Porch eligibility and credits when upgrading to the bundle remain unspecified. This release does not broaden the existing community policy or promise upgrade credits.

## Release

This release includes the previously prepared lesson viewer and import schema plus individual-module access, the embedded sales video and corrected price/selection pages. Course records and the module-access migration are applied to the existing TEACH database; no payment account or hosting provider was created.


Supabase security advisor found no issue on the new table. Existing notices concern the separate activity generator and leaked-password checking; this import does not alter those settings.
