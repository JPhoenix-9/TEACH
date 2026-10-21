# Product page decisions

Approved by the owner on October 20, 2026:

- Homeschool Success Blueprint is a paid flagship available at launch with its own homepage destination.
- Blueprint Christmas offer: $199, reduced from $279. No end date established.
- GAP belongs under Courses & Curriculum and has its own complete sales page with four grade-band choices.
- The owner owns homeschoolsuccessblueprint.com and gapcurriculum.com. Intended destination pages are /blueprint and /curriculum/gap within TEACH. Domain configuration has not been changed.
- Library and Webinars & Videos are free at launch; Planner and Courses & Curriculum are paid destinations. Specific content availability and access must remain truthful.

Draft implementation notes:

- /curriculum/gap uses the locked shared Header and original product cover artwork preserved in public/products/.
- GAP factual basis: https://www.homeschool-911.com/gap-curriculum (retrieved October 20, 2026).
- GAP Christmas Sale approved: $79 per grade-band package, reduced from $129, retaining the old site's pricing. No end date established. The draft links to the original shop for enrollment.
- Grade-specific checkout destinations and eventual TEACH fulfillment still need wiring. The draft explicitly identifies its original-shop links.
- Page copy and layout are drafts for owner review, not new permanent specifications.

Owner clarification, October 20, 2026:

- GAP includes teaching methods, complete instructions, and age-appropriate curriculum specific to each subject area.
- Families can download GAP and be homeschooling in 20 minutes.
- Everything needed for 4–6 weeks is included; no other purchase is needed.
- GAP is a zero worksheet curriculum; this must be prominent in its positioning.
- Use actual product images for the packages, not destination icons as product substitutes. Original artwork was retrieved from the existing GAP and shop pages.

Launch content clarification:

- GAP is currently the only curriculum. /curriculum should open its sales page directly, rather than showing a separate catalog.
- Two webinars exist. The first is "5 Shifts to Stress-Free Homeschooling," free, presented by Jana Sheridan. Source: https://www.homeschool-911.com/webinar-registration.
- The second is filmed but unreleased and covers the ten most commonly asked homeschooling questions. "10 Common Questions About Homeschooling" is a proposed display title, pending the owner's wording. Show Coming Soon until release is authorized and the recording is supplied.
- /webinars drafts a free webinar collection with the first linked to its existing registration page. No direct video source or new registration integration has been supplied yet.

Webinar registration requirement:

- Public visitors may see the webinar titles and descriptions. Recordings require registration for the selected webinar.
- Capture name, email address, and explicit permission to receive TEACH communications before granting viewing access. Do not infer communication permission from a free account or a purchase.
- Proposed consent wording: "Yes, I agree to receive emails from TEACH with homeschooling guidance, news, and offers. I can unsubscribe at any time." Use an unchecked consent control and retain the wording/version, timestamp, and webinar registration alongside the email address.
- Recording access must be checked on the server; do not expose a public recording URL in page source or use a browser-only flag as the gate.
- Confirm the destination email platform/list and access approach before implementing the live registration integration. The draft currently links the available webinar to the old registration page; the new TEACH capture and viewing flow is not yet connected.

Registration page design drafts:

- Shared template at /webinars/5-shifts/register and /webinars/common-questions/register.
- First name, email, explicit unchecked email permission, and Register Free action. Preview-only disabled fieldset prevents submitting or implying capture before integration exists.
- Both pages display an explicit design-preview notice and are excluded from search indexing. Existing webinar catalog continues to link the actual old registration flow until the new integration is ready.
- The 5 Shifts registration page uses the original old-homepage Webinar1 photograph of a mother and two children learning at home, preserved unchanged in public/webinars/five-shifts-homepage.png.
- The newer webinar remains Coming Soon; displaying its registration design does not authorize its release.
- Brevo supports separate brand folders, lists, and sender addresses within one account. The owner's existing account could not be inspected because sign-in was unavailable; plan/settings remain unverified. Revisit later without interrupting design work for another login request.
