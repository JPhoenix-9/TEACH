# Activity Generator home and direct field trips — November 5, 2026

Jana's new direction supersedes the earlier decision to offer field trips only after activity ideas.

Home has a two-by-two grid:
| | Left | Right |
| --- | --- | --- |
| Top | Plan an Activity | Plan a Field Trip |
| Bottom | Saved Plans | Update Family Profile |

Plan a Field Trip begins with participants, guest details, topic and duration, then opens location, editable 50-mile radius, dates and total trip budget. It makes no activity-generation request before opening the trip screen. Searches, results, no-match messages and radius edits remain on that screen until the parent navigates away. The existing field-trip entry from activity results remains available. An optional activity-ideas action is also available from direct trip planning.

AI searches remain blocked by Vercel's billing verification; navigation and form availability do not establish a successful live search.

## November 6 — plan screen and Planner references

The instructions screen is separate from ideas and field-trip searches. It opens at a focused, visible Activity Instructions heading and displays the activity title, including in print. Plan actions are Save Plan, Print, Back to Ideas (or the originating direct field-trip screen), and either Add to Planner for an active Planner term or a $5.99/year Planner purchase prompt. Direct full-plan revision and substitution controls are removed per the owner's simplified screen; idea substitutions remain on the ideas screen. More ideas and field-trip search controls remain on their own screens.

Add to Planner saves the complete activity in the archive first if necessary. The Planner receives only the title, a one-sentence overview limited to 140 characters, and a mandatory saved-activity link. The date and family/child assignment remain selectable. Archive failures must not produce unlinked Planner entries. Links reopen the stored instructions without generating them again; queries are scoped to the authenticated owner and remain protected by RLS. Valid archive links survive login.

The Planner page displays the approved $5.99/year price. Checkout itself is still pending commerce verification and is not represented as available by this change. Field-trip generation failure reported November 6 remains a separate unresolved issue.

Verification: 49 automated checks and production build passed. A synthetic-data browser check covers desktop and 390px layouts, clean plan navigation even when trip search was previously expanded, focus/scroll, print title, subscription gating, save-before-add, short note/link, archive reopening, error states, and returning to ideas. Run `node scripts/verify-activity-plan-ui.cjs` after building, with Playwright and a Chromium browser installed; optional `TEACH_UI_CHROMIUM_EXECUTABLE` and `TEACH_UI_CHROMIUM_ARGS` select an existing browser runtime. This test mocks the network and does not establish real AI or live checkout readiness. Live schema inspection confirmed owner-only archive/subscription reads and subscription/child authorization in append_activity_note.
