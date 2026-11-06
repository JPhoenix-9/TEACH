# TEACH launch checkpoint — November 6, 2026

Target: Saturday, November 7, 5 p.m. Eastern. This is a checkpoint, not launch approval.

## Completed and released

| Area | Evidence and limits |
| --- | --- |
| AI setup | Owner activated free AI Gateway credits and verified a card. Both generators have GPT-5 mini configured as the primary model. Activity generation worked live; Transcript generation still needs a genuine authenticated test. |
| Activity quality | Educational instructions, appropriate participation, concise choices and short essential supplies were improved. Owner reported that the repeated butterfly test was much better. Other ages/topics and the full instruction quality are not yet accepted. |
| Plan screen | Instructions open at the heading with the activity title. Ideas/search controls remain off this screen. Save, print, return and conditional Planner actions are implemented. |
| Planner integration | Full activity saves to the archive before adding a brief title/overview/link to the Planner. Archive links reopen the stored plan and survive login. New browser checks use synthetic data. |
| Field trips | The earlier live attempt timed out after 106,771 ms. PR #24 limits research/checking workloads, distinguishes completed no-match searches from failures, preserves settings and clears stale destinations. Live destination research after this change remains unverified. |
| Front Porch / Ask Jana | PR #25 and its applied database migration recognize current purchase/license records. Active Planner-only accounts get private Ask Jana, not shared conversations. Other families' questions remain private. Authors can remove their own messages; staff alone can restore hidden content. Replies below removed threads are restricted. |
| My Desk | Current per-student Transcript licenses are recognized as purchases. Existing artwork/layouts are preserved. |

## Verification

- All 55 automated tests passed, including actual-route tests with mocked search responses and isolated real-SQL authorization tests.
- Production build passed. Desktop and 390px Chromium checks passed for the activity/Planner flow, field-trip outcomes, Planner-only Ask Jana, message removal and Transcript ownership on My Desk. These are synthetic network fixtures, not real customer journeys or Safari testing.
- Live database checks confirmed signed-out denial, anonymous removal denial, the invoker public removal wrapper, owner-only archive/subscription reads, fixed-search-path authorization helpers and unchanged security advisor findings. Intentional internal-table restrictions and guarded privileged functions were preserved.
- The contact form already has bounded requests and duplicate-safe retry checks, with an administrator review view. Actual support email delivery and a genuine submitted-message walkthrough are still pending.
- No real test conversations, purchase records or payment charges were created during these checks.

## Resume with the owner

1. Continue reviewing the saved butterfly instructions on the corrected screen.
2. Run one authenticated field-trip search, including a broader radius if needed. Inspect actual output, timing and sources; do not infer live success from mocked tests.
3. Test Transcript AI with a fictional student project, review its primary/fallback model behavior, and verify file saving/reopening on the owner's computer and mobile Safari.

Commerce and operational launch work remains: real checkout and webhook fulfillment, Planner purchasing, product delivery/content availability, email/domain checks, customer access/revocation journeys and final mobile/privacy acceptance. Keep Transcript sales disabled until their acceptance and payment checks pass. Review the existing [password-security setting](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection) without silently activating a paid plan.

## Privacy notice wording prepared for owner review

The current notice predates the generators and does not describe their learning profiles, saved activity archives or AI processing. The following factual addition is prepared for review; it is not yet published as website policy and makes no provider retention/training guarantees:

> If you use the Activity Generator, your account stores the learning profiles you enter, including interests, strengths, reading comfort, learning considerations, sensory or mobility needs, dislikes and safety or allergy information. Saved activities and field-trip plans are stored in your family account. Adding an activity to the Planner stores a brief reminder and a link to the full saved plan.
>
> When you request AI assistance, the information relevant to that request is processed through Vercel AI Gateway and the selected AI provider. This can include your topic, participants' ages and grade levels, learning-profile details, learning experiences, course information and previous generated text. Research requests use topic/location or institution information; stored child profiles and academic records are not added to the web-search prompts. Information you type into a topic or research question is still part of that request.
>
> Transcript projects are saved to the editable file you choose on your device. Your account stores the related license and usage information. AI-assisted interviews and college checks can process the learning or course information needed for the requested help. Your generated activity and transcript information is not published as a community conversation.

Before publishing this addition, confirm the current provider/data-handling settings and the owner's final wording. Do not represent the existing privacy review, email delivery, checkout or launch acceptance as complete.
