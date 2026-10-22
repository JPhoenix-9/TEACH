# TEACH Planner and Attendance specifications

## Established requirements

Recovered from the owner's October 16, 2026 decisions, alongside the October 21 access clarification:

- A simple notes and reminder calendar. No Google Calendar integration.
- Attendance uses a simple checkmark, a daily family note, and optional child-specific notes.
- Print attendance for a single child or the whole family.
- Select a date range or school year when printing.
- A child's report includes the family notes plus that child's notes, without siblings' private notes.
- Student profiles are shared across TEACH tools and stored with the family account. Baseline student fields are name and grade level; the latest signup request adds child ages and household count.
- Save planning and attendance records to the account/server so they follow the parent across devices. Browser-only persistence is not the product's storage model.
- Use the approved leather planner destination artwork. A two-page spread with calendar on the left and attendance on the right is the prior design direction, not an excuse to expand feature scope.

## Purchase and access

- Planner is a standalone paid product, purchasable independently of Blueprint, curriculum, and generators.
- Its purchase grants the Planner tools at My Desk. It does not grant Front Porch access.
- Community eligibility requires Blueprint, curriculum, or generator purchase. Keep Planner entitlement separate from community entitlement.
- Stripe is on hold. Do not advertise a new Planner checkout as working before it is configured and tested.

## Choices still needed

- Whether one family-wide attendance check marks every child by default with individual exceptions, or each child is always checked separately.
- Purchase price and whether access is one-time or recurring.
- Organization selection for the separate TEACH backend project, followed by cost review and provisioning. Do not use the Chef Jay production project for TEACH data.

## Working implementation approach

- Monthly calendar with day selection and clear notes/reminders. Configurable school-year date boundaries.
- Family student selector and attendance entry panel; preserve the simple checkmark workflow.
- Printable reports use selected children and date boundaries, with clean print styling and no sales/navigation elements.
- Private family records, server-side ownership checks, and verified Planner entitlement before writing or reading customer records.
- These implementation defaults can be refined once the remaining owner decisions are supplied. There is no working Planner application or authenticated storage yet.
