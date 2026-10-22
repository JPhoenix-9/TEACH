# Accounts and customer access

Owner decisions recorded October 21, 2026. These govern the future account implementation; current pages remain public previews and purchase invitations.

## Access model

| Visitor state | My Desk | Front Porch |
| --- | --- | --- |
| Not signed in | Public product showcase and account invitation | Public purchase invitation only; no community entry or private content |
| Free account with no purchase history | Personal desk functioning as a product advertisement, with recommendations; tools and product access locked | No community entry, private posts, or participation; show purchase suggestions |
| Planner-only customer | Purchased Planner tools unlocked at My Desk when available | No community entry, private content, or participation; show qualifying product suggestions |
| Verified Blueprint, curriculum, or generator customer | Purchased resources and appropriate customer features unlocked when available | Community entry and participation when available |

- Qualifying community purchases are Blueprint, curriculum products (including GAP), or generators. Planner alone is excluded. No separate community membership purchase is required.
- Planner must be purchasable independently of other products. Buying it does not automatically grant community membership.
- Buying one product does not grant all other paid products. Product entitlements are distinct from the shared customer benefits.
- Free webinar registration, email permission, and free account creation are not purchases.
- Enforce community and product access on the server and in database/storage access policies. Client UI visibility is not authorization.
- Purchase eligibility must come from trusted purchase records, never editable profile metadata, browser storage, or user-submitted customer flags.
- Historical purchase recognition, checkout integration, and customer access checks remain to be implemented.

## Free account family profile

Owner requested parent name and contact information plus number and ages of children. Implementation defaults:

| Field | Signup behavior | Purpose |
| --- | --- | --- |
| Parent name | Required | Identify the parent and personalize the account |
| Email address | Required | Account identity, account messages, and contact |
| Phone number | Optional | Additional contact information |
| Number of children | Required, allow zero | Household profile and the number of age inputs |
| Age of each child | One age in years per child; allow zero for infants | Relevant product and curriculum suggestions |

- The number of age inputs should follow the child count; profile edits must keep these in sync.
- Store a profile update timestamp so ages are understood as user-supplied ages at that time. Parents must be able to update the information.
- Signup collects child count and ages. When a tool needs named student records, use the shared child profiles previously specified by the owner: name and grade level, with age from the family profile. Do not duplicate students independently across tools. Exact dates of birth and postal addresses are not required for this signup profile.
- Parent contact information and children's ages are private profile data. Do not expose them in public pages, community profiles, posts, or public APIs.
- A parent can edit only their own profile. Private profile access and any authorized administrative access must be explicitly scoped.
- Use ages to suggest resources; let parents confirm the appropriate GAP grade band rather than treating age as a guaranteed grade placement.
- Email marketing permission is a separate explicit choice. Recording it does not grant customer eligibility or community access.
- The current Coming Soon page describes these signup plans but does not collect or store profile information.

## Implementation prerequisites

- A separate TEACH backend project is needed. The only discovered Supabase organization is named Chef Jay’s, and its only project belongs to Chef Jay. Organization selection for the TEACH project is awaiting the owner's answer; do not change the Chef Jay project.
- Check costs before provisioning any service. Stripe is on hold.
- Support inbox support@teachforlove.com is not active. Transactional email and account recovery delivery require setup and verification before signup is advertised as working.
