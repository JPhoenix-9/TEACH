# TEACH one-time checkout

Live Stripe account: acct_1UTS0sEH2BoIIOEO. Catalog mapping: stripe-live-catalog.json (11 products, 15 one-time USD prices). GAP has a first-package price of $59.99 and an additional distinct grade-band price of $49.99. Blueprint modules are $29.99 and the complete course is $149.99.

## Implementation

Supabase Edge Function teach-commerce handles status, authenticated checkout, cancellation of unfinished GAP checkouts, and the Stripe webhook. Customers must sign in with a confirmed email and complete their family profile. Prices and discount eligibility are resolved from server-owned tables and trusted product access. A reservation locks each family to serialize GAP pricing and reuses one Stripe session per order. Customers cannot submit an amount, price ID or another family ID.

Webhook endpoint: https://jhooodlcvcpnzcpreqmu.supabase.co/functions/v1/teach-commerce/webhook

Webhook ID: we_1UYGgjEH2BoIIOEOT4e3Yqo3. The signing secret was stored automatically in encrypted Supabase Vault as teach_stripe_webhook_secret; it is not in this repository. Stripe signatures are verified against raw request bodies. Fulfillment also re-reads Stripe session and line items and checks paid status, environment, order, family, product, price, amount and quantity before granting access in one database transaction. Replays are idempotent. Failed/expired/unpaid sessions do not grant access.

Success page only polls the signed-in family’s order status; it cannot grant access. Resources uses the existing exact-product RLS policies and private signed PDF downloads. The full Blueprint bundle grants all six modules, and an individual module grants only that module.

Secrets are read through a service-role-only RPC wrapping a nonexposed private Vault function. Anonymous and authenticated roles cannot reserve/fulfill orders, write catalog prices, or retrieve secrets. Checkout validates Supabase user tokens directly; webhook JWT verification is intentionally disabled so Stripe can reach the endpoint, with Stripe signature validation performed inside the handler.

## Remaining external configuration

The server still needs a TEACH live restricted API key: preferred Vault name teach_stripe_secret_key. STRIPE_SECRET_KEY in Supabase Edge Function secrets is supported as an alternative. Never paste the value in chat, repository files, or browser JavaScript. Required capabilities include Checkout Sessions write/read, Payment Intents write (for session creation), Customers write (as required by Checkout), Prices/Products read and account read. Use a restricted key rather than the full-risk master key.

The readiness endpoint currently returns ready:false because that key is missing. Checkout is kept closed until both the key and webhook secret are available and the key matches the enabled live TEACH account. No paid checkout or customer grant was fabricated. No live payment has been made for testing.

The owned domains teachforlove.com and www.teachforlove.com were added to the existing Vercel project. DNS is external (ns77/ns78.domaincontrol.com) and still resolves to GoDaddy parking A records 3.33.130.190 and 15.197.148.33. Vercel reports misconfigured. Root suggested IPs: 216.198.79.1 / 64.29.17.1 (rank 1), 76.76.21.21 (rank 2). Suggested CNAME: 1c69be3267de091a.vercel-dns-017.com. WWW is configured to redirect to the root. Change only web A/CNAME records at the authoritative DNS provider; preserve MX/TXT and mail configuration.

Stripe review of business_profile.url remains pending; the account has charges_enabled and payouts_enabled true, but its account API response lists no payout bank. Confirm payout-bank setup directly in Stripe. Tax registration/product classification and customer-facing refund terms have not been changed by this implementation; review them before launch. Automatic tax is not claimed or silently enabled.

## Verification

18 tests pass, including authenticated-family cancellation of an unfinished GAP checkout. Tests include isolated Postgres reservation, discount, ownership, idempotency and row-isolation checks; exact paid-session validation; and real Stripe signature verification around mocked Stripe reads (no charge). Production build passes. Live status returns ready:false, unsigned checkout returns 401, and anonymous/customer privileges for fulfillment and secret access are denied. Billing tables intentionally have RLS with no customer policies except own-order reads. The security advisor’s other warnings predate this work.
