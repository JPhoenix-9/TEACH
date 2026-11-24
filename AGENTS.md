<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project instructions

## Project independence — user directive, November 24, 2026

- Treat every app or website as an independently owned, operable, and transferable project by default.
- Do not place one project's backend, database tables, authentication, file storage, deployment resources, credentials, or service resources inside another project's infrastructure without the user's explicit prior approval for that specific shared dependency.
- Separate tables, schemas, or access policies within another project's database still constitute shared infrastructure and require approval.
- Separate supplier accounts and logins are required by default for each new entity. The entity setup gate below applies before implementation; any shared management account requires an explicitly approved exception.
- Before requesting approval to share infrastructure, name the projects and resources involved, recurring costs and plan limits, consequences of pausing/deleting/transferring either project, data and security boundaries, and the independent alternative.
- Cost pressure, convenience, free-tier quotas, and generic permission to build do not authorize sharing or nesting projects. If the budget prevents independent infrastructure, explain the constraint and ask the user to choose before proceeding.
- Maintain a dependency and operating-cost inventory in each project's documentation. Account for existing production projects before adding resources that consume shared account quotas.
- Do not pause, move, or alter another project's resources as an incidental part of work on the current project.
- Existing shared infrastructure is not retroactively approved. Document it and propose separation; do not migrate, disconnect, or delete live resources merely to enforce this rule without a concrete plan and user authorization.
- This directive applies to future work on Chef Jay, TEACH, The Hub, Big Dog, and other user projects. It does not claim existing sharing has already been removed.

## Entity setup before building — user directive, November 24, 2026

1. Before implementing a new entity's app, website, or integrations, establish its identity and account ownership. Determine whether it needs its own email address; if so, set up and verify that email first.
2. Establish the entity's own accounts and logins with the major suppliers it actually needs, including GitHub, Vercel, Supabase, and any payment, email, domain, or AI providers. Do not default to another entity's supplier accounts.
3. Verify supplier account eligibility, free-plan limits, inactivity rules, and expected combined operating cost before provisioning or building dependencies. If a supplier does not permit the requested separate-account arrangement, explain the limitation and obtain a choice before proceeding; do not silently substitute a shared account.
4. Get explicit approval before incurring expenses. General permission to build does not authorize subscriptions, paid upgrades, or sharing accounts or infrastructure.
5. Maintain a clear non-secret account register for the entity: supplier, account/organization/project name, sign-in URL, login email, sign-in method (password, GitHub, Google, etc.), owner, plan and recurring cost, and the location of password-manager and recovery records. Never put passwords, private API keys, MFA seeds, or recovery codes in source files, ordinary project documents, or chat.
6. Verify that the user can access the entity's email and supplier accounts before implementation starts. Do not add providers that are not needed.
7. Record any specifically approved shared supplier account as an exception, naming the projects and resources it covers. Sharing a management account never implicitly authorizes sharing a backend, database, authentication, or storage.
8. Preserve existing user-approved transition plans, including placing The Hub and a separate Big Dog project under the proposed new Supabase account. This future-work rule is not authorization to migrate or disconnect existing apps or to create accounts now.
