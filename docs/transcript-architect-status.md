# Transcript Architect implementation — November 5, 2026

The 56-section master specification is in transcript-master-specification.md. The price is $79 per student, not $29. This implementation replaces the coming-soon image with a working, purchase-gated workspace. New public purchases remain closed pending the new product's authenticated walkthrough and sandbox payment review. The existing commerce readiness endpoint now reports ready:true; earlier notes about a missing restricted key are stale.

## Implemented

- Student and school setup, enrolled/graduated status, graduation date, editable administrative title and contact details, NCAA question and current official documentation research.
- Brief pre-ninth-grade orientation, subject-area coursework sequence, batch title parsing, fully editable rows, SC/IP, failed attempts, Honors/AP/Dual Enrollment details, and deterministic credit-weighted GPA with configurable points and bonuses. AP requires administrator confirmation of Course Audit authorization. Underlying years remain available and visible.
- Blank-category discovery, explicit Fine Arts private-lesson prompts, PE/technology examples, deeper unconventional-learning interviews, frequency/hours/scope/mastery review, qualifying/more-information/not-qualifying outcomes, editable proposals, descriptions developed with the experience, and parent-supplied grades.
- Course-title and description review in batches of 20, factual notes, editable description preference, original/suggestion/reason and parent choice. No suggested academic facts are automatically accepted.
- Actual subject-area transcript, parent certification tied to a SHA-256 digest of the current academic record, real downloadable Unicode PDFs, addendum, and per-page copyright. Changes invalidate certification; SC has no GPA points, IP has neither earned credit nor GPA points, F has zero earned credit but its attempted credits remain in the GPA denominator.
- Versioned JSON project download/import with validation, file size limits, malformed/duplicate-ID rejection, unsaved-close reminders, nontechnical saving instructions, backup advice and no localStorage academic record. Project ID is random; name corrections are allowed. Project files are ordinary editable files, not encrypted containers; parents choose safe storage.
- Exact-school discovery and parent confirmation, official-source research isolated from private academic comparison, dated cited reports, admissions questions, best-match wording, unchanged factual record across versions, stale-report protection and repeat-school accounting.
- Server-owned three-year entitlements, one project per purchase, owner-only RLS, atomic binding, request limits, 12 unique institutions, and signed server verification before committing a successful school check. Direct clients cannot self-grant or extend licenses, read signing material, or forge completed school checks.

## Privacy and authentication

Permanent server data consists of license ID, owning TEACH user ID, random project ID, purchase/expiry/revocation metadata, canonical institution identifiers and check dates, and request-limit counters. Student names, school identity, coursework, grades, descriptions, reports and certification are not saved in the database. AI requests are transient server/provider processing; this is not a promise that an outside AI provider has zero retention. Request bodies and provider responses are not logged by application code. Private records are not placed in web searches.

This integrates with TEACH's existing sign-in to verify purchase ownership. Accountless receipt/capability-token access is not implemented. A parent’s edited project file cannot extend a purchase or restore school slots. Local files cannot prove that two differently named records represent the same human; the binding identifies one parent-managed student project, with legitimate name corrections permitted.

## Deployment configuration

Supabase schema: supabase/transcript-architect.sql. Additive tables and RPCs were installed in the existing TEACH project. A private signing key is provisioned separately, outside git, and matches the production-only TRANSCRIPT_RESEARCH_SECRET in the existing Vercel TEACH project. No service-role secret is required by the Next route. The API uses validated user JWTs plus narrowly scoped database functions. Default AI model openai/gpt-6-luna was verified against the current gateway model list; TRANSCRIPT_AI_MODEL can override it. Vercel's existing AI Gateway/OIDC arrangement is used.

The four authenticated SECURITY DEFINER functions are intentional: staff-only creation, owner/expiry-checked single-project binding, owner/expiry-checked rate reservation, and owner/expiry/HMAC-checked institution accounting. Fixed empty search paths, explicit revokes/grants, identity checks and row locks are part of their contract. transcript_requests intentionally has no client policy or grants. Existing project password-protection settings were not changed.

## Still required before customer sales

- Complete the new product’s authenticated walkthrough and sandbox payment review. The existing TEACH payment service currently reports ready:true. The $79 product/price have been created in the existing live TEACH account and fulfillment has been prepared to create one independent license per paid order. TRANSCRIPT_CHECKOUT_ENABLED remains absent/false, so sales stay closed. Do not use product_access's one-row-per-product entitlement for this product: additional children require independent licenses. No paid purchase can currently be completed, and no live charge has been attempted.
- Perform an authenticated end-to-end review with the real TEACH administrator session and a sandbox payment journey before opening sales. Local deterministic and policy tests do not prove live AI quality, official-source search quality, or a payment webhook round trip.
- School-specific layout supports subject grouping or chronological grouping and explicitly displays academic year/grade level for every course; arbitrary institution-specific form templates are not supported. College checks must not claim these unsupported forms have been satisfied.
- Optional AI help naming a school is not implemented; a truthful family-name example is supplied.

## Verification

32 automated tests passed on the first complete run, including transcript record/PDF tests, integrated SQL authorization/usage tests and independent-student purchase/replay checks. The production build passed. The SQL test uses PGlite and a documented HMAC stand-in because pgcrypto is not bundled; live Postgres HMAC compatibility is verified separately. Transcript PDFs were generated with a Unicode name and long/multipage course records, rendered and visually inspected.

Local browser QA was blocked by the managed preview wrapper passing Vite flags (--host/--strictPort) to this Next.js project. Working app scripts were not changed to compensate. Browser interaction checks must be completed against a deployed preview or the live administrator workspace.

Live TEACH catalog product: prod_VZiEwCWAedNQK2; price: price_1UYYo8EH2BoIIOEOP96hqvJK ($79 one time). No checkout session or charge was created. Commerce integration is in supabase/transcript-commerce.sql and preserves all existing product fulfillment. The existing return page opens the transcript workspace for a paid transcript order.

The connected Postgres pgcrypto HMAC result exactly matched Node crypto for a fixed fixture. Live privilege checks confirmed anonymous access, client license self-grants and private signing-schema access are denied. Production commerce status was rechecked and reports ready:true; this product remains independently gated off by TRANSCRIPT_CHECKOUT_ENABLED.

## Automatic saving — November 5, 2026

The generator now checkpoints complete projects and workflow position in IndexedDB on edits and screen/subject/discovery transitions. Drafts are namespaced by signed-in account and project ID. Saved Transcripts lists local projects and reopens the saved step. Unfinished interviews, proposals and unadded title drafts are retained. Save receipts control the visible status, failures offer retry/export, and revision checks prevent silent overwrites from another tab. Sign-out clears the open workspace without deleting local saved projects. Export/import remains the portable backup path; full academic records remain off the server. Browser data clearing/private sessions/device changes can remove the local copy and are explained in the interface.

Saving controls now appear prominently at the top of every open project, with a sticky automatic-save status, Save Now, and Download Backup. They remain visible when scrolling long grids. The buried sidebar backup control has been removed. Manual Save Now uses the same checked local writer as automatic saving.

## File-first saving — November 5, 2026

Supersedes the browser autosave workflow above. Before form entry, a modal asks the parent to name and save the editable project file. Supported file pickers grant a working handle; ordered writes update that same selected file and only report success after close commits. A changed-file check protects against external edits. Other browsers use the system share/save dialog or download, instructions to use the same name/folder and Replace, and explicit completion confirmation. Unsaved transitions show the save prompt. The file contains the current workflow step and unfinished learning/title drafts. Earlier IndexedDB records remain available for recovery, but new student records are no longer written there. Browser restrictions prevent the app from verifying a Save to Files/share/download completion, so portable saves are accurately described as parent-confirmed. Real device dialogs still require a signed-in device walkthrough.
