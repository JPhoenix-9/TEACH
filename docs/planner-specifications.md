# TEACH Planner and Attendance specifications

## Established requirements

Recovered from the owner's October 16, 2026 decisions, alongside the October 21 access clarification:

- A simple notes and reminder calendar. No Google Calendar integration.
- Attendance uses an independent checkbox beside each child's name at the top of the daily page. Family notes and individual notes are both optional and can coexist on any date.
- Print attendance for a single child or the whole family.
- Select a date range or school year when printing.
- A child's report includes the family notes plus that child's notes, without siblings' private notes.
- Student profiles are shared across TEACH tools and stored with the family account. Baseline student fields are name and grade level; the latest signup request adds child ages and household count.
- Save planning and attendance records to the account/server so they follow the parent across devices. Browser-only persistence is not the product's storage model.
- Match the approved brown leather planner icon. The latest owner instruction places attendance and notes on one page, perpetual monthly calendar opposite. The owner confirmed calendar LEFT and daily attendance/notes RIGHT on October 21, 2026. Scrollbars belong on the outer page edges; use the exact approved botanical leaf, a full-length realistic ribbon down the center, and a soft slow paper rustle rather than an impact-like sound. Calendar opens to the current month automatically, page-turn navigation accesses other months, and text is entered directly into date squares for any plan or event. Optional page-turn sound is welcome.
- Open from My Desk as a mini-app occupying about 80% of the screen. Permanent family archive across years and devices is mandatory; temporary browser records are not an acceptable production archive.

## Purchase and access

## Printing decisions October 21 2026

## Calendar day expansion — October 22 2026

- Clicking anywhere in a date square opens a larger single-day calendar square, matching the planner's cream paper and brown leather styling. This supersedes direct editing inside the small grid square.
- The popup shows the date prominently and provides a readable, scrolling multiline writing area without a character limit imposed by the square. Long entries remain intact; the monthly grid shows a compact preview with an Open entry cue.
- Reopening a date displays its complete entry for reading or editing. Done, the close button, or Escape closes the popup without discarding edits. Keep entries associated with their original dates and available to existing print reports.
- Keyboard activation and native modal focus behavior are required. The current sample still resets on reload until permanent account storage is connected.

## Print formats

- Three content choices: attendance only; attendance and notes; notes only.
- Each format supports one child or the whole family in one report, over a specified date range.
- Attendance is a simple date-by-child chart. Every report containing attendance shows total school days for each selected child. Count a child's checked date once; do not add sibling days together as a family total.
- Notes-only reports omit the attendance chart, attendance marks and day tallies. Attendance-only reports omit notes entirely. Combined reports contain the same chart followed by dated notes.
- Keep the report heading, family/child scope, date-range presentation and typography consistent across formats. Individual notes reports include family notes and the selected child's notes, never siblings' private notes.
- The owner requires a TEACH copyright footer at the bottom of EVERYTHING printed. Reuse the shared footer in all future print/export implementations; repeat it on every printed page. Current wording: © YEAR TEACH · Higher Ground Publishing.
- Retain printing inside the Planner. File folders become the central hub for all student data, eventually including transcripts and assigned curriculum; they may also print Planner data using the same report component. This is the specifically permitted redundancy.
- Remove the standalone printer object/icon from the desk; it has no separate role. This supersedes earlier printer placement requirements.

## Purchase and access details

Latest visual decision, October 21, 2026: remove the bookmark ribbon completely; retain the three-ring binding. This supersedes all earlier ribbon design requests.

- Planner is a standalone paid product, purchasable independently of Blueprint, curriculum, and generators.
- Its purchase grants the Planner tools at My Desk. It does not grant Front Porch access.
- Community eligibility requires Blueprint, curriculum, or generator purchase. Keep Planner entitlement separate from community entitlement.
- Stripe is on hold. Do not advertise a new Planner checkout as working before it is configured and tested.

## Choices still needed

- Attendance decision resolved: each child has their own checkbox, checked by the parent if that child was schooled that day.
- Purchase price and whether access is one-time or recurring.
- Organization selection for the separate TEACH backend project, followed by cost review and provisioning. Do not use the Chef Jay production project for TEACH data.

## Working implementation approach

- Monthly calendar with day selection and clear notes/reminders. Configurable school-year date boundaries.
- Family student selector and attendance entry panel; preserve the simple checkmark workflow.
- Printable reports use selected children and date boundaries, with clean print styling and no sales/navigation elements.
- Private family records, server-side ownership checks, and verified Planner entitlement before writing or reading customer records.
- `/planner/preview` now demonstrates the mini-app design with fictional children, session-memory records, optional paper sound, month page turning, editable calendar squares and date-range report printing. It is explicitly a sample preview, excluded from search indexing. My Desk and the Planner introduction link to it.
- Production authentication, purchase checks and permanent archive storage remain unconnected. See `planner-preview-status.md` for the full implementation boundary and latest owner decisions.

## Print economy — October 21, 2026

- Make paper and ink economy a priority for every Planner print format. Attendance uses one compact month-by-day grid per child, with day columns 1–31, monthly totals and an overall school-day tally. A full year is twelve rows per child, not hundreds of dated rows.
- The whole-family summary contains each selected child's grid in the same flowing report. Avoid forced page breaks between children, months, or dated notes. Notes use compact readable black text, modest margins and spacing, and may flow across pages. No leather textures, decorative imagery, large display headings, or shaded table backgrounds on paper.
- Preserve the date range, selected child privacy, all complete notes, and the TEACH copyright at the bottom of every page. Long notes may require more pages; do not truncate them to achieve a page count.

## Digital copies and date range — October 21 2026

- Every printing and export flow must require a From and Through date range and apply it consistently to the preview, printed report, PDF, Word document and data download. Keep child selection and attendance/notes content selection consistent across outputs. Changing these selections invalidates the old preview before exporting.
- Print / Save as PDF opens the device print dialog; the parent chooses its PDF saving destination. Download Word document produces a real DOCX locally with compact attendance grids, complete selected notes and a repeating TEACH copyright footer. Download data file produces a versioned JSON file of the selected date range and records, with scope, dates and copyright. It is not an entire-account backup and does not yet have an import/restore tool.
- File names include content, child/family scope and date range. Export is local on the device. The current fictional sample preview remains session-only; downloaded files do not imply permanent account storage is connected.

The raw JSON option is labeled Download data file rather than backup because no Planner import or restore feature currently exists. Word and PDF are the ordinary readable digital copies.
