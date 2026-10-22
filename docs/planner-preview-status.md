# Planner preview — October 22, 2026

Database update October 22: the separate TEACH project now has tested private family, child, subscription and Planner tables. See `teach-backend-status.md`. Website accounts and Planner saving remain unconnected; the preview still resets on reload. This supersedes the earlier open question about backend organization selection, but does not make the product ready for real family records.

Owner has specified independent per-child attendance checkboxes at the top of the daily page, optional family and individual child notes on the same day, and a perpetual monthly calendar opposite. Open to the current month; page turn between months; type directly into date squares for any plans or events. Match the approved leather planner icon, with optional page-turn sounds.

Open from My Desk as an embedded mini-app covering about 80% of the screen. Desktop workspace uses 90vw by 90dvh (81% viewport area). On narrow screens pages stack within the workspace. Keep the shared site header source unchanged.

Print either one child's record or the family record over any specified date range. Individual reports include family notes and that child's notes, excluding sibling notes and sibling attendance. Calendar entries are common family plans. Unchecked attendance means not marked, not a verified absence.

Permanent family archive is mandatory. Records must persist across devices and school years. Production requires authenticated family-owned server storage, Planner purchase entitlement, retention policy and tested backup/recovery plus export. Session-memory or device-only records do not satisfy this requirement. No real family data should be entered into the design preview.

Implemented `/planner/preview`: fictional sample family, session-memory editing, month paging with paper-like sound, date-specific attendance and notes, date-range report preview and browser printing. Explicit demo notice and no search indexing. No account storage, authentication, purchase gate, or checkout connected. My Desk links this preview without representing it as purchased access.

Still needed: standalone Planner price and billing model; organization choice and cost review for a separate TEACH backend. Stripe remains on hold. Planner alone does not grant Front Porch entry.

## Owner refinements — October 21, 2026

Calendar on the left, attendance/notes on the right. The daily page scrollbar is clearly visible along the outer right edge; calendar overflow scrolls on its outer left edge. Replace all substitute botanical glyphs with the exact approved header leaf artwork, reused unchanged. Lay a fabric-style ribbon down the center seam for the full book height. Page-turn sound uses a much quieter 1.15-second rustle with slow attack and release; animation also slows to 0.85 seconds. These are design refinements; archive/account limitations remain unchanged.

Further owner review: replace the straight ribbon with a curved satin ribbon, woven texture, folds and an attachment recessed into the upper binding. Replace synthetic rustle entirely with the actual recorded page turn, sound 164 by DavidGreck (CC0, LaSonotheque; see public/sounds/README.md). Keep sound optional. Suppress normal image dragging, image-specific context menus and touch callouts across the site; opt out of Pinterest saving overlays. Browser-owned UI/extensions and screenshots cannot be completely controlled by website code.

Navigation report investigated on the live deployment: Back to My Desk, header Blueprint/Home and homepage My Desk icon all navigated correctly in browser testing. Chat screenshots are static images; interactive controls require the live site. Do not claim these working links were repaired. Keep normal anchor navigation intact when suppressing image interactions.

Final owner decision, October 21, 2026: REMOVE the bookmark ribbon entirely. It does not belong with the three-ring binding. Keep the three-ring binding and do not reintroduce a ribbon.
