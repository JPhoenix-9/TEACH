# Private live checkout test

The dedicated test page uses the existing TEACH sign-in. The live checkout
function only allows this offer for the exact confirmed family user UUID
configured as TEACH_PRIVATE_CHECKOUT_USER_ID. Keep the public bundle button
disabled.

Before enabling the test, apply the combined entitlement SQL and add the K–2
bundle to the live price catalog using a live Stripe price for USD 198.99.
Verify the private coupon remains valid, one use, 100% off, and unused. Ensure
the live webhook receives checkout.session.completed. Do not copy test Stripe
prices into the live catalog.

Sign in with the designated test family, open /blueprint/private-checkout-test,
and confirm Stripe shows $0 due. Finish checkout and verify the order and both
products in My Desk. Clear TEACH_PRIVATE_CHECKOUT_USER_ID after fulfillment is
verified. No payment is taken, and the paid checkout flow remains a separate test.
