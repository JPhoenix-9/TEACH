import {buildPrintReport} from "./model.mjs";
import s from "./planner.module.css";
import PrintCopyright from "../../components/PrintCopyright";

const titles={attendance:"Attendance record","attendance-notes":"Attendance and notes",notes:"Notes record"};
function formatDate(day,options={month:"long",day:"numeric",year:"numeric"}){return new Date(`${day}T12:00:00`).toLocaleDateString("en-US",options);}

// Shared report layout for the Planner and the future Family Records hub.
export default function PlannerReport({records,children,report}){
  const data=buildPrintReport(records,children,report.scope,report.start,report.end,report.content);
  return <section className={s.report} data-print-report="true" aria-label="Printable record preview">
    <div className={s.reportActions}><p>Sample record preview</p><button type="button" className={s.primary} onClick={()=>window.print()}>Print this record</button></div>
    <header className={s.reportHeader}><p>TEACH · FAMILY LEARNING RECORD</p><h2>{titles[report.content]}</h2><p><strong>{report.scope==="family"?"Whole family":data.children[0]?.name}</strong>{report.scope==="family"&&` · ${data.children.map(c=>c.name).join(", ")}`}</p><p>{formatDate(report.start)} – {formatDate(report.end)}</p><small>Design preview · fictional sample records</small></header>
    {data.hasAttendance&&<section className={s.attendanceReport} aria-label="Attendance chart"><h3>Attendance</h3><div className={s.tableWrap}><table className={s.attendanceTable}><caption>School days marked for {report.scope==="family"?"the family":data.children[0]?.name}</caption><thead><tr><th scope="col">Date</th>{data.children.map(c=><th scope="col" key={c.id}>{c.name}</th>)}</tr></thead><tbody>{data.attendanceRows.length?data.attendanceRows.map(row=><tr key={row.day}><th scope="row">{formatDate(row.day,{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</th>{data.children.map(c=><td key={c.id}>{row.attendance[c.id]?<><span aria-hidden="true">✓</span><span className={s.srOnly}>Schooled</span></>:<><span aria-hidden="true">—</span><span className={s.srOnly}>Not marked</span></>}</td>)}</tr>):<tr><td colSpan={data.children.length+1}>No school days marked in this period.</td></tr>}</tbody><tfoot><tr><th scope="row">Total school days</th>{data.totals.map(c=><td key={c.id}>{c.days}</td>)}</tr></tfoot></table></div><p className={s.reportLegend}>✓ Schooled · — Not marked. Totals count each child’s checked dates once. Only dates with recorded attendance are listed.</p></section>}
    {data.hasNotes&&<section className={s.notesReport} aria-label="Dated notes"><h3>Notes</h3>{data.notesRows.length?data.notesRows.map(row=><article className={s.reportDay} key={row.day}><h4>{formatDate(row.day,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</h4>{row.event&&<p><strong>Calendar:</strong> {row.event}</p>}{row.familyNote&&<p><strong>Family notes:</strong> {row.familyNote}</p>}{row.children.map(c=><p key={c.id}><strong>{c.name}’s notes:</strong> {c.note}</p>)}</article>):<p className={s.emptyReport}>No notes recorded in this period.</p>}</section>}
    <PrintCopyright />
  </section>;
}
