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
- A shared vendor or management login does not itself mean shared infrastructure. Do not create extra accounts or expenses simply to enforce isolation; propose the independent resource arrangement and its full costs first.
- Before requesting approval to share infrastructure, name the projects and resources involved, recurring costs and plan limits, consequences of pausing/deleting/transferring either project, data and security boundaries, and the independent alternative.
- Cost pressure, convenience, free-tier quotas, and generic permission to build do not authorize sharing or nesting projects. If the budget prevents independent infrastructure, explain the constraint and ask the user to choose before proceeding.
- Maintain a dependency and operating-cost inventory in each project's documentation. Account for existing production projects before adding resources that consume shared account quotas.
- Do not pause, move, or alter another project's resources as an incidental part of work on the current project.
- Existing shared infrastructure is not retroactively approved. Document it and propose separation; do not migrate, disconnect, or delete live resources merely to enforce this rule without a concrete plan and user authorization.
- This directive applies to future work on Chef Jay, TEACH, The Hub, Big Dog, and other user projects. It does not claim existing sharing has already been removed.
