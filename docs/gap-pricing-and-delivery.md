# GAP pricing and delivery

Owner-approved November 4, 2026: $59.99 first grade band, $49.99 each additional distinct grade band. The $10 additional-package discount carries forward to later purchases on the same family account. It does not increase with purchase count. No all-four bundle is approved.

## Delivery

All four original Wix curriculum PDFs were copied byte-for-byte to the private Supabase teach-resources bucket and verified by SHA-256 after storage download. Source inventory and checksums: gap-source-files.json. No paid PDFs are committed to the public repository.

| Entitlement | Pages | Private storage path |
| --- | ---: | --- |
| gap-k2 | 21 | gap/gap-k2/curriculum.pdf |
| gap-35 | 29 | gap/gap-35/curriculum.pdf |
| gap-68 | 29 | gap/gap-68/curriculum.pdf |
| gap-912 | 25 | gap/gap-912/curriculum.pdf |

The existing teach_materials RLS policy requires an active exact product_access grant (or administrator access). Storage SELECT requires visible teach_materials metadata. Resources generates five-minute signed download links. Blueprint or another GAP grade band does not grant a different GAP PDF. Original Wix template introduction steps are omitted. Wix has not been modified; these new copies do not require Wix for delivery.

The authenticated one-time import job accepted only a short-lived random import key and four fixed, checksum-verified sources. After successful import it was replaced with a 410 response and JWT verification enabled. No account secret was exposed or copied into the repository.

## Enrollment status and remaining payment work

The public sales page displays the approved pricing and links to a TEACH selection page per grade band. Selection checks the signed-in family’s trusted product_access records; existing owners open Resources, and another active GAP grade band displays $49.99. Anonymous visitors see $59.99 with a sign-in prompt for existing buyers. Failed account checks do not show a confirmed quote.

Online payment is intentionally unavailable. Live TEACH Stripe is not connected/ready. Before enabling payment: recompute ownership and the $10 discount server-side for the authenticated family; reject duplicate grade-band purchases; create the Stripe session with the correct price; validate Stripe webhook signatures and product/price/account IDs; grant only the paid grade band idempotently after verified payment. Never accept a client-supplied price or profile metadata as eligibility. No live payment or webhook fulfillment is claimed by this release.

An original Homeschool-911 purchase must be matched to a verified family grant before it can qualify for the discount. Checkout must use that persisted server-managed record. Refund and disputed-payment rules have not been changed by this release.

## Validation

Twelve automated checks pass, including persistent discount and duplicate ownership rules, existing Blueprint isolation, and isolated Postgres tests of the production GAP material/storage SELECT predicates. Production build passes. Live storage metadata confirms all four files in a nonpublic bucket. Anonymous signed-URL creation is denied. Stored PDF bytes were downloaded inside the authenticated import and verified against source SHA-256. No real customer account or payment was used for tests.
