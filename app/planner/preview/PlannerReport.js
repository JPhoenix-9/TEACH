import {attendanceMonths,buildPrintReport} from "./model.mjs";
import s from "./planner.module.css";
import PrintCopyright from "../../components/PrintCopyright";
import {downloadRecord,exportFilename,selectedRecordExport,wordDocument} from "./record-export.mjs";

const titles={attendance:"Attendance record","attendance-notes":"Attendance and notes",notes:"Notes record"};
function formatDate(day,options={month:"long",day:"numeric",year:"numeric"}){return new Date(`${day}T12:00:00`).toLocaleDateString("en-US",options);}

// Shared report layout for the Planner and the future Family Records hub.
export default function PlannerReport({records,children,report,preview=true}){
  const data=buildPrintReport(records,children,report.scope,report.start,report.end,report.content);
  const months=attendanceMonths(data.attendanceRows,report.start,report.end);
  return <section className={s.report} data-print-report="true" aria-label="Printable record preview">
    <div className={s.reportActions}><p>{preview?"Sample record preview":"Family record preview"}</p><button type="button" className={s.primary} onClick={()=>window.print()}>Print / Save as PDF</button><button type="button" className={s.exportButton} onClick={()=>downloadRecord(wordDocument(selectedRecordExport(records,children,report,preview)),"application/vnd.openxmlformats-officedocument.wordprocessingml.document",exportFilename(report,"docx"))}>Download Word document</button><p className={s.exportHint}>For a PDF, choose Save as PDF in your device’s print options. Download a Word document for a readable digital copy. Both options use the date range and contents above.</p></div>
    <header className={s.reportHeader}><p>TEACH · FAMILY LEARNING RECORD</p><h2>{titles[report.content]}</h2><p><strong>{report.scope==="family"?"Whole family":data.children[0]?.name}</strong>{report.scope==="family"&&` · ${data.children.map(c=>c.name).join(", ")}`}</p><p>{formatDate(report.start)} – {formatDate(report.end)}</p>{preview&&<small>Design preview · fictional sample records</small>}</header>
    {data.hasAttendance&&<section className={s.attendanceReport} aria-label="Attendance chart"><h3>Attendance</h3>{data.children.map(child=><div className={s.compactAttendance} key={child.id}><div className={s.tableWrap}><table className={`${s.attendanceTable} ${s.monthlyAttendance}`}><caption>{child.name} · School days</caption><thead><tr><th scope="col">Month</th>{Array.from({length:31},(_,i)=><th scope="col" key={i}>{i+1}</th>)}<th scope="col">Total</th></tr></thead><tbody>{months.map(month=><tr key={month.month}><th scope="row">{formatDate(month.month,{month:"short",year:"numeric"})}</th>{month.days.map((attendance,i)=><td key={i} aria-label={attendance===null?"Outside selected period or month":attendance[child.id]?"Schooled":"Not marked"}>{attendance?.[child.id]?"✓":""}</td>)}<td>{month.days.filter(day=>day?.[child.id]).length}</td></tr>)}</tbody><tfoot><tr><th scope="row" colSpan={32}>Total school days · {child.name}</th><td>{data.totals.find(c=>c.id===child.id)?.days||0}</td></tr></tfoot></table></div></div>)}<p className={s.reportLegend}>✓ Schooled. Blank cells are unmarked or outside the selected period. Totals count each child’s checked dates once.</p></section>}
    {data.hasNotes&&<section className={s.notesReport} aria-label="Dated notes"><h3>Notes</h3>{data.notesRows.length?data.notesRows.map(row=><article className={s.reportDay} key={row.day}><h4>{formatDate(row.day,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</h4>{row.event&&<p><strong>Calendar:</strong> {row.event}</p>}{row.familyNote&&<p><strong>Family notes:</strong> {row.familyNote}</p>}{row.children.map(c=><p key={c.id}><strong>{c.name}’s notes:</strong> {c.note}</p>)}</article>):<p className={s.emptyReport}>No notes recorded in this period.</p>}</section>}
    <PrintCopyright />
  </section>;
}
