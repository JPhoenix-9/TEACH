"use client";
import {useEffect,useRef,useState} from "react";
import {dateKey,monthCells} from "./model.mjs";
import PlannerReport from "./PlannerReport";
import useFamilyPlanner from "../workspace/useFamilyPlanner";
import s from "./planner.module.css";

const sampleChildren=[{id:"emma",name:"Emma",grade:"Grade 3"},{id:"noah",name:"Noah",grade:"Grade 1"}];
const empty={attendance:{},childNotes:{},familyNote:"",event:""};
function pretty(key,options={weekday:"long",month:"long",day:"numeric",year:"numeric"}){return new Date(`${key}T12:00:00`).toLocaleDateString("en-US",options);}

export default function Planner({preview=true}){
  const workspace=useFamilyPlanner(!preview);
  const children=preview?sampleChildren:(workspace.data?.children.filter(c=>!c.archived_at)||[]);
  const reportChildren=preview?sampleChildren:(workspace.data?.children||[]);
  const canEdit=preview||!!workspace.data?.canEdit;
  const [today,setToday]=useState("");const [day,setDay]=useState("");const [month,setMonth]=useState(null);
  const [previewRecords,setRecords]=useState({});const records=preview?previewRecords:workspace.records;const [notesOpen,setNotesOpen]=useState({});
  const [sound,setSound]=useState(true);const [turn,setTurn]=useState(0);const [direction,setDirection]=useState("next");
  const [start,setStart]=useState("");const [end,setEnd]=useState("");const [scope,setScope]=useState("family");const [content,setContent]=useState("attendance");const [report,setReport]=useState(null);const [printOpen,setPrintOpen]=useState(false);
  const [calendarDay,setCalendarDay]=useState(null);
  const audio=useRef(null),turnTimer=useRef(null),panel=useRef(null),printDialog=useRef(null),dayDialog=useRef(null);
  useEffect(()=>{
    const now=new Date(),key=dateKey(now);setToday(key);setDay(key);setMonth([now.getFullYear(),now.getMonth()]);
    setStart(dateKey(new Date(now.getFullYear(),now.getMonth(),1)));setEnd(key);
    if(preview)setRecords({[key]:{...empty,attendance:{emma:true,noah:true},familyNote:"We read together and explored the garden.",event:"Nature walk · library visit"}});
    panel.current?.focus();const timer=setInterval(()=>setToday(dateKey(new Date())),60000);
    return()=>{clearInterval(timer);clearTimeout(turnTimer.current);audio.current?.pause();};
  },[]);
  useEffect(()=>{if(printOpen)printDialog.current?.showModal();else printDialog.current?.close();},[printOpen]);
  useEffect(()=>{if(calendarDay)dayDialog.current?.showModal();else dayDialog.current?.close();},[calendarDay]);
  function openCalendarDay(key){chooseDay(key);setCalendarDay(key);}
  function update(key,changes){if(!preview){workspace.update(key,changes);return;}setRecords(old=>({...old,[key]:{...empty,...old[key],...changes}}));}
  function paperSound(){
    if(!sound)return;
    const recording=audio.current;if(!recording)return;
    recording.currentTime=0;recording.play().catch(()=>{});
  }
  function pageTurn(delta){paperSound();setDirection(delta<0?"previous":"next");setTurn(v=>v+1);clearTimeout(turnTimer.current);turnTimer.current=setTimeout(()=>setTurn(0),850);setMonth(([y,m])=>{const d=new Date(y,m+delta,1);return[d.getFullYear(),d.getMonth()];});}
  function chooseDay(key){setDay(key);}
  const record=records[day]||empty,cells=month?monthCells(...month):[],monthTitle=month?new Date(...month,1).toLocaleDateString("en-US",{month:"long",year:"numeric"}):"";
  return <main className={s.backdrop}>
    <audio ref={element=>{audio.current=element;if(element){element.volume=.35;element.playbackRate=.9;}}} src="/sounds/page-turn-recorded.mp3" preload="auto" aria-hidden="true"/>
    <div className={s.deskBackdrop} aria-hidden="true"><img src="/Icons/planner.png" alt=""/><p>A place for your family’s learning.</p></div>
    <section className={s.app} aria-labelledby="planner-title" ref={panel} tabIndex={-1}>
      <div className={s.appBar}><div><span className={s.brand}>TEACH <img className={s.approvedLeaf} src="/teach-approved-leaf.png" alt="" aria-hidden="true"/></span><h1 id="planner-title">Family planner</h1></div><nav aria-label="Planner controls"><button type="button" aria-pressed={sound} onClick={()=>{if(sound)audio.current?.pause();setSound(v=>!v);}}>Sound {sound?"on":"off"}</button><button type="button" disabled={!preview&&(workspace.state!=="ready"||workspace.pending>0)} onClick={()=>setPrintOpen(true)}>Print records</button><a href="/my-desk" onClick={e=>{if(!preview&&workspace.pending&&!window.confirm("Some entries have not saved. Leave this page and discard those unsaved changes?"))e.preventDefault();}}>Back to My Desk <span aria-hidden="true">×</span></a></nav></div>
      {preview?<p className={s.previewNotice}><strong>Design preview · sample family.</strong> Try with sample text only. Changes reset on reload; account saving is not connected.</p>:<div className={s.previewNotice}><span role="status" aria-live="polite">{workspace.state==='loading'?'Opening your family’s Planner…':workspace.state==='error'?'Your Planner could not be opened.':canEdit?(workspace.pending?'Saving your changes…':'All changes saved to your family account.'):'Your Planner is read-only. You can read, print and download saved records. Editing opens with an active Planner subscription.'}</span>{workspace.data&&!workspace.data.profile&&<p><a href="/account">Complete your family profile →</a></p>}{Object.entries(workspace.errors).map(([key,error])=><p role="alert" key={key}>{key!=='load'&&<strong>{key}: </strong>}{error.replace('PLANNER_CONFLICT: ','')}{error.includes('PLANNER_CONFLICT')?<button type="button" onClick={()=>workspace.keepMine(key)}>Save my version instead</button>:key!=='load'&&<button type="button" onClick={workspace.retry}>Try saving again</button>}</p>)}</div>}
      {(!month||(!preview&&workspace.state!=="ready"))?<p className={s.loading}>{workspace.state==="error"?"Refresh to try opening your Planner again.":"Opening your planner…"}</p>:<div className={s.leather}>
        <img className={s.cornerTL} src="/teach-approved-leaf.png" alt="" aria-hidden="true"/><img className={s.cornerBR} src="/teach-approved-leaf.png" alt="" aria-hidden="true"/>
        <div className={s.book}>
          <section className={`${s.paper} ${s.calendarPage} ${turn?s.turning:""}`} data-direction={direction} aria-label="Monthly calendar">
            <div className={s.paperHeading}><p className={s.smallCaps}>PLANS, POSSIBILITIES & EVERYDAY LIFE</p><div className={s.monthHeading}><button type="button" aria-label="Previous month" onClick={()=>pageTurn(-1)}>‹</button><h2 aria-live="polite">{monthTitle}</h2><button type="button" aria-label="Next month" onClick={()=>pageTurn(1)}>›</button></div><div className={s.rule}/></div>
            <div className={s.calendarTools}><span>Click any square for more room to write.</span><button type="button" onClick={()=>{const now=new Date();setMonth([now.getFullYear(),now.getMonth()]);chooseDay(dateKey(now));}}>Current month</button></div>
            <div className={s.calendar}><div className={s.weekdays}>{["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d=><span key={d}>{d}</span>)}</div><div className={s.dateGrid} style={{"--weeks":cells.length/7}}>{cells.map((key,i)=>key?<div key={key} className={`${s.dateCell} ${key===day?s.selected:""} ${key===today?s.today:""}`}><button className={s.calendarSquare} type="button" aria-label={`Open calendar day for ${pretty(key)}${records[key]?.event?", has an entry":""}`} aria-haspopup="dialog" onClick={()=>openCalendarDay(key)}><span className={s.squareDate}>{Number(key.slice(-2))}{key===today&&<span className={s.todayDot} aria-label="Today"/>}</span><span className={s.squarePreview}>{records[key]?.event||""}</span>{records[key]?.event&&<span className={s.squareMore}>Open entry</span>}</button></div>:<div key={`blank-${i}`} className={`${s.dateCell} ${s.blank}`} aria-hidden="true"/>)}</div></div>
            <p className={s.calendarCaption}>Field trips. Lessons. Beautiful ordinary days.</p><div className={s.pageFoot}><button type="button" onClick={()=>pageTurn(-1)}>← Previous month</button><img className={s.footerLeaf} src="/teach-approved-leaf.png" alt="" aria-hidden="true"/><button type="button" onClick={()=>pageTurn(1)}>Next month →</button></div>
          </section>
          <div className={s.binding} aria-hidden="true"><i/><i/><i/></div>
          <section className={`${s.paper} ${s.daily}`} aria-label="Daily attendance and notes">
            <div className={s.paperHeading}><p className={s.smallCaps}>THE DAYS WE LEARN TOGETHER</p><h2>Attendance & notes</h2><div className={s.rule}/></div>
            <div className={s.dateRow}><label htmlFor="record-date">Record for</label><input id="record-date" type="date" required value={day} onChange={e=>{if(e.target.value)chooseDay(e.target.value);}}/><button type="button" onClick={()=>chooseDay(today)}>Today</button></div>
            <p className={s.dayLabel}>{pretty(day)}</p>
            <fieldset className={s.attendance}><legend>Who was schooled today?</legend>{!children.length&&<p>Add children in <a href="/account">your family profile</a> to keep attendance.</p>}{children.map(child=><label key={child.id} className={s.childCheck}><input type="checkbox" disabled={!canEdit} checked={!!record.attendance[child.id]} onChange={e=>update(day,{attendance:{...record.attendance,[child.id]:e.target.checked}})}/><span>{child.name}<small>{child.grade}</small></span><span className={s.checkHint}>{record.attendance[child.id]?"Schooled today":"Not marked"}</span></label>)}</fieldset>
            <label className={s.noteLabel} htmlFor="family-note">Family notes <span>optional</span></label><textarea id="family-note" readOnly={!canEdit} className={s.linedNote} value={record.familyNote} placeholder="Something to remember about this day…" onChange={e=>update(day,{familyNote:e.target.value})}/>
            <div className={s.childNotes}><p className={s.noteLabel}>Individual notes <span>optional</span></p>{children.map(child=><div key={child.id} className={s.childNote}><button type="button" aria-expanded={notesOpen[child.id]??!!record.childNotes[child.id]} aria-controls={`notes-${child.id}`} onClick={()=>setNotesOpen(o=>({...o,[child.id]:!(o[child.id]??!!record.childNotes[child.id])}))}>{child.name}’s notes <span aria-hidden="true">{(notesOpen[child.id]??!!record.childNotes[child.id])?"−":"+"}</span></button>{(notesOpen[child.id]??!!record.childNotes[child.id])&&<textarea id={`notes-${child.id}`} readOnly={!canEdit} aria-label={`${child.name}'s notes`} className={s.childText} value={record.childNotes[child.id]||""} placeholder={`A note just for ${child.name}…`} onChange={e=>update(day,{childNotes:{...record.childNotes,[child.id]:e.target.value}})}/>}</div>)}</div>
            <div className={s.pageFoot}><span>Our family’s story, one day at a time.</span><img className={s.footerLeaf} src="/teach-approved-leaf.png" alt="" aria-hidden="true"/></div>
          </section>
        </div>
      </div>}
      <p className={s.archiveStatus}>{preview?"Sample workspace":"Private family archive"} <span>{preview?"Changes reset on reload":workspace.pending?"Keep this page open until changes are saved.":"Your records follow your account across devices."}</span></p>
    </section>
    <dialog className={s.dayDialog} ref={dayDialog} onCancel={()=>setCalendarDay(null)} onClose={()=>setCalendarDay(null)} aria-labelledby="calendar-day-title" aria-describedby="calendar-day-hint">
      <div className={s.daySheet}><header className={s.daySheetHeader}><p className={s.smallCaps}>{calendarDay?pretty(calendarDay,{month:"long",year:"numeric"}):""}</p><button type="button" className={s.closeDay} aria-label="Close calendar day" onClick={()=>setCalendarDay(null)}>×</button><h2 id="calendar-day-title"><span>{calendarDay?Number(calendarDay.slice(-2)):""}</span>{calendarDay?pretty(calendarDay,{weekday:"long"}):""}</h2></header>
      <label className={s.dayEntryLabel} htmlFor="calendar-day-entry">Plans & notes</label><textarea autoFocus readOnly={!canEdit} id="calendar-day-entry" className={s.dayEntry} value={records[calendarDay]?.event||""} placeholder="A field trip, a lesson, an appointment… or a whole day’s worth of plans." onChange={e=>update(calendarDay,{event:e.target.value})}/>
      <footer className={s.daySheetFooter}><p id="calendar-day-hint">{preview?"Room for the whole story. Changes in this preview reset on reload.":canEdit?"Room for the whole story. Changes save automatically to this date.":"Read your complete entry here. This Planner is currently read-only."}</p><button type="button" className={s.primary} onClick={()=>setCalendarDay(null)}>Done</button></footer></div>
    </dialog>
    <dialog className={s.printDialog} ref={printDialog} onCancel={()=>setPrintOpen(false)} aria-labelledby="print-title"><div className={s.printControls}><div><p className={s.eyebrow}>KEEP A COPY</p><button type="button" className={s.closePrint} aria-label="Close print records" onClick={()=>setPrintOpen(false)}>×</button><h2 id="print-title">Your records, on paper.</h2><p>Choose the content, children and dates. Individual notes reports include shared family notes and that child’s notes.</p></div><form onChange={()=>setReport(null)} onSubmit={e=>{e.preventDefault();setReport({scope,start,end,content});}}><label>Include<select value={content} onChange={e=>setContent(e.target.value)}><option value="attendance">Attendance only</option><option value="attendance-notes">Attendance and notes</option><option value="notes">Notes only</option></select></label><label>Record for<select value={scope} onChange={e=>setScope(e.target.value)}><option value="family">Whole family</option>{reportChildren.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>From<input type="date" required max={end||undefined} value={start} onChange={e=>setStart(e.target.value)}/></label><label>Through<input type="date" required min={start||undefined} value={end} onChange={e=>setEnd(e.target.value)}/></label><button className={s.primary} type="submit" disabled={!start||!end||start>end}>Preview record</button></form><p className={s.printHint}>Attendance prints as a chart with school-day totals for each child. Notes include calendar entries, family notes and the selected children’s notes.</p></div>
      {report&&<PlannerReport records={records} children={reportChildren} report={report} preview={preview}/>}
    </dialog>
  </main>;
}
