# TEACH prelaunch review — November 4, 2026

## Changes

- Narrow-screen header preserves the approved mark, name, tagline, colors and desktop design while wrapping the brand within phone widths. Mobile navigation and account controls have 44-pixel touch heights; search text uses 16 pixels to avoid iOS input zoom.
- GAP and Blueprint selection sign-in links carry the exact selected product. Login returns to that selection. Signup and password-reset navigation keep the destination through the account flow. A confirmed/new account goes through family profile setup before showing a continuation link.
- Only a closed allowlist of internal destinations is accepted; external URLs, invalid products, duplicate product parameters, auth loops and token fragments fall back to /account. A nonsecret return destination is kept in localStorage so confirmation opened in another tab in the same browser can retain it. This value never grants access or changes a price. A confirmation opened on a different device falls back to the account page.
- Blueprint ownership checks now show loading and failure states rather than silently treating a failed lookup as a nonbuyer.
- Contact, tour and ordering instructions reflect TEACH selection pages, purchaser-only Blueprint/GAP delivery and checkout availability. The existing unverified support-inbox notice remains; no email delivery claim has been made.

## Evidence

- Production build passes. Fourteen automated tests pass, including product totals, discount persistence, exact grade/module isolation, and return-destination validation.
- Seventeen principal public page URLs returned HTTP 200.
- Temporary preview-only iframe checks exercised actual page CSS at 320, 390 and 768 pixel frame widths. Core page scroll widths matched the available viewport widths: no sideways overflow. These are responsive browser checks, not a physical iPhone/Safari test.
- At 320 pixels: home, GAP, Blueprint, login, signup, contact, GAP selection and individual Blueprint selection checked; no broken loaded images found. At 390 and 768 pixels: home, GAP, Blueprint and login checked.
- Browser followed login → create-account with the original GAP grade-band selection preserved in the URL. Two different synthetic passwords displayed the local mismatch error; no account was created and no confirmation email was sent.
- Temporary responsive review page was removed before production publication.

## Still unverified / blocked

- No real user login, email confirmation, reset email or profile write was performed during this review. Current access controls and file verification are covered by the preceding course/GAP work and isolated policy tests; no purchaser browser session was fabricated.
- Live TEACH Stripe remains unconnected/restricted. No checkout, payment, purchase webhook or paid fulfillment was attempted. The product pages keep checkout closed.
- Actual phone/Safari confirmation and a complete sandbox payment journey are still needed before launch.
