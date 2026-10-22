# TEACH print standards

Every printed output must carry `© YEAR TEACH · Higher Ground Publishing` at the bottom of every printed page. The owner established this as a site-wide requirement on October 21, 2026.

Reuse `app/components/PrintCopyright.js` in report/export layouts. The root layout supplies this footer for general browser printing. Dedicated report layouts include their own instance and suppress the root duplicate. Reserve a bottom page margin so the fixed print footer does not overlap records.

Planner reports use `PlannerReport.js` and `buildPrintReport` as a shared implementation for the Planner and future Family Records hub. Three content modes: attendance; attendance and notes; notes. Each supports family or individual child scope and date boundaries. Attendance is tabular with a school-day total per child; notes are grouped by date. Notes-only output contains no attendance or tally. Child scope must exclude sibling data.

Current preview remains fictional and session-only. The shared report components do not provide account storage, entitlements or permanent archival guarantees.
