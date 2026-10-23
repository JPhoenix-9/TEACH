# Front Porch

Approved direction, October 23, 2026: warm daylight; inside the approved farmhouse porch with wicker seating and mountain view; tiny distant neighbors only; noticeable, realistically scaled Wishing Well in the yard. Header and homepage artwork remain unchanged.

Five areas: Homeschooling Support, TEACH Curriculum (currently GAP), Generators, Homeschool Success Blueprint, and Ask Jana. Generators remain Coming Soon, with a brief explanation and suggestions welcomed. No extra channels at launch.

Shared threads and replies require a trusted, non-revoked Blueprint or GAP purchase. Free accounts, webinars and Planner-only subscriptions do not qualify. Administrators can enter and moderate. Future generator product keys must be explicitly added to the trusted purchase schema and eligibility helper when those products launch. No speculative product keys grant entry today.

Ask Jana is private to the thread starter and trusted TEACH administrators, including all replies. It is an asynchronous conversation, with no guaranteed response time or automatic email notifications. Wishing Well links to the existing private submission form, which remains distinct from public member discussions.

Supabase stores threads/replies. RLS enforces purchase and privacy rules for every read/write. A private, authenticated identity trigger supplies first-name-only labels and trusted staff badges; no email, child profile or contact data is shared. Only the hidden flag can be changed. Authors can remove their own messages from view; administrators can hide/restore and read hidden content for moderation. Hidden content is retained, not permanently erased. Contact & Help is the private reporting path. No new software or paid subscription is required for this implementation.

Conversations use bounded, paginated lists with refresh. Posts are plain text (6,000 characters); subjects are limited to 160 characters. Nonstaff posting is throttled to one message per ten seconds. Requests fail closed and clear private results when account identity changes. Drafts remain on posting failure; closing asks before discarding a draft. Native modal dialogs support Escape, focus return and outer-edge scrolling. No live chat, attachments, member directory, direct member messaging or email notifications at launch.

Existing-purchase matching and new checkout remain separate launch tasks. The community works for accounts with trusted qualifying entitlements; do not grant purchase access merely to make a demo appear unlocked.

Artwork revision: the approved porch now includes a glass lemonade pitcher and exactly three partially filled iced lemonade glasses on the foreground table. Versioned asset: public/front-porch-room-v2.webp.

Validation: production build passes. Transactional integration checks passed for Blueprint/GAP eligibility, first-name identity stamping, staff impersonation prevention, private thread/reply isolation, denied nonpurchaser writes, revoked access, moderation hide/restore, immutable content and anonymous denial. No test records were committed. Security advisor found no new issues.

Artwork revision: two parents playing ball with three children on the lawn replace the distant pair. The warm daylight, porch, Wishing Well, lemonade pitcher and three iced glasses remain. Current asset: public/front-porch-room-v3.webp.

Wishing Well wording: invite wants and needs for existing TEACH resources and future creations. Porch tag: “Tell us what you want & need.” Remove privacy as the promotional emphasis. This copy update does not change who can read previously submitted wishes.
