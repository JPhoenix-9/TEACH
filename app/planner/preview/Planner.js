"use client";
import {useEffect,useRef,useState} from "react";
import {dateKey,monthCells,makeReport} from "./model.mjs";
import s from "./planner.module.css";

const children=[{id:"emma",name:"Emma",grade:"Grade 3"},{id:"noah",name:"Noah",grade:"Grade 1"}];
const empty={attendance:{},childNotes:{},familyNote:"",event:""};
function pretty(key,options={weekday:"long",month:"long",day:"numeric",year:"numeric"}){return new Date(`${key}T12:00:00`).toLocaleDateString("en-US",options);}

export default function Planner(){
  const [today,setToday]=useState("");const [day,setDay]=useState("");const [month,setMonth]=useState(null);
  const [records,setRecords]=useState({});const [notesOpen,setNotesOpen]=useState({});
  const [sound,setSound]=useState(true);const [turn,setTurn]=useState(0);const [direction,setDirection]=useState("next");
  const [start,setStart]=useState("");const [end,setEnd]=useState("");const [scope,setScope]=useState("family");const [report,setReport]=useState(null);const [printOpen,setPrintOpen]=useState(false);
  const audio=useRef(null),turnTimer=useRef(null),panel=useRef(null),printDialog=useRef(null);
  useEffect(()=>{
    const now=new Date(),key=dateKey(now);setToday(key);setDay(key);setMonth([now.getFullYear(),now.getMonth()]);
    setStart(dateKey(new Date(now.getFullYear(),now.getMonth(),1)));setEnd(key);
    setRecords({[key]:{...empty,attendance:{emma:true,noah:true},familyNote:"We read together and explored the garden.",event:"Nature walk · library visit"}});
    panel.current?.focus();const timer=setInterval(()=>setToday(dateKey(new Date())),60000);
    return()=>{clearInterval(timer);clearTimeout(turnTimer.current);audio.current?.close();};
  },[]);
  useEffect(()=>{if(printOpen)printDialog.current?.showModal();else printDialog.current?.close();},[printOpen]);
  function update(key,changes){setRecords(old=>({...old,[key]:{...empty,...old[key],...changes}}));}
  function paperSound(){
    if(!sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const ctx=audio.current||(audio.current=new Audio());ctx.resume();
      const buffer=ctx.createBuffer(1,ctx.sampleRate*.32,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
      const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=buffer;filter.type="bandpass";filter.frequency.value=1500;filter.Q.value=.5;
      gain.gain.setValueAtTime(.001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.1,ctx.currentTime+.07);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.32);
      source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start();source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
    }catch{/* Decorative sound may be unavailable without affecting the planner. */}
  }
  function pageTurn(delta){paperSound();setDirection(delta<0?"previous":"next");setTurn(v=>v+1);clearTimeout(turnTimer.current);turnTimer.current=setTimeout(()=>setTurn(0),550);setMonth(([y,m])=>{const d=new Date(y,m+delta,1);return[d.getFullYear(),d.getMonth()];});}
  function chooseDay(key){setDay(key);}
  const record=records[day]||empty,cells=month?monthCells(...month):[],monthTitle=month?new Date(...month,1).toLocaleDateString("en-US",{month:"long",year:"numeric"}):"";
  const reportRows=report?makeReport(records,children,report.scope,report.start,report.end):[];
  const reportChildren=report?.scope==="family"?children:children.filter(c=>c.id===report?.scope);
  return <main className={s.backdrop}>
    <div className={s.deskBackdrop} aria-hidden="true"><img src="/Icons/planner.png" alt=""/><p>A place for your family’s learning.</p></div>
    <section className={s.app} aria-labelledby="planner-title" ref={panel} tabIndex={-1}>
      <div className={s.appBar}><div><span className={s.brand}>TEACH <span aria-hidden="true">✧</span></span><h1 id="planner-title">Family planner</h1></div><nav aria-label="Planner controls"><button type="button" aria-pressed={sound} onClick={()=>setSound(v=>!v)}>Sound {sound?"on":"off"}</button><button type="button" onClick={()=>setPrintOpen(true)}>Print records</button><a href="/my-desk">Back to My Desk <span aria-hidden="true">×</span></a></nav></div>
      <p className={s.previewNotice}><strong>Design preview · sample family.</strong> Try with sample text only. Changes reset on reload; account saving is not connected.</p>
      {!month?<p className={s.loading}>Opening your planner…</p>:<div className={s.leather}>
        <div className={s.cornerTL} aria-hidden="true">❦</div><div className={s.cornerBR} aria-hidden="true">❦</div>
        <div className={s.book}>
          <section className={`${s.paper} ${s.daily}`} aria-label="Daily attendance and notes">
            <div className={s.paperHeading}><p className={s.smallCaps}>THE DAYS WE LEARN TOGETHER</p><h2>Attendance & notes</h2><div className={s.rule}/></div>
            <div className={s.dateRow}><label htmlFor="record-date">Record for</label><input id="record-date" type="date" required value={day} onChange={e=>{if(e.target.value)chooseDay(e.target.value);}}/><button type="button" onClick={()=>chooseDay(today)}>Today</button></div>
            <p className={s.dayLabel}>{pretty(day)}</p>
            <fieldset className={s.attendance}><legend>Who was schooled today?</legend>{children.map(child=><label key={child.id} className={s.childCheck}><input type="checkbox" checked={!!record.attendance[child.id]} onChange={e=>update(day,{attendance:{...record.attendance,[child.id]:e.target.checked}})}/><span>{child.name}<small>{child.grade}</small></span><span className={s.checkHint}>{record.attendance[child.id]?"Schooled today":"Not marked"}</span></label>)}</fieldset>
            <label className={s.noteLabel} htmlFor="family-note">Family notes <span>optional</span></label><textarea id="family-note" className={s.linedNote} value={record.familyNote} placeholder="Something to remember about this day…" onChange={e=>update(day,{familyNote:e.target.value})}/>
            <div className={s.childNotes}><p className={s.noteLabel}>Individual notes <span>optional</span></p>{children.map(child=><div key={child.id} className={s.childNote}><button type="button" aria-expanded={notesOpen[child.id]??!!record.childNotes[child.id]} aria-controls={`notes-${child.id}`} onClick={()=>setNotesOpen(o=>({...o,[child.id]:!(o[child.id]??!!record.childNotes[child.id])}))}>{child.name}’s notes <span aria-hidden="true">{(notesOpen[child.id]??!!record.childNotes[child.id])?"−":"+"}</span></button>{(notesOpen[child.id]??!!record.childNotes[child.id])&&<textarea id={`notes-${child.id}`} aria-label={`${child.name}'s notes`} className={s.childText} value={record.childNotes[child.id]||""} placeholder={`A note just for ${child.name}…`} onChange={e=>update(day,{childNotes:{...record.childNotes,[child.id]:e.target.value}})}/>}</div>)}</div>
            <div className={s.pageFoot}><span>Our family’s story, one day at a time.</span><span aria-hidden="true">❧</span></div>
          </section>
          <div className={s.binding} aria-hidden="true"><i/><i/><i/></div>
          <section className={`${s.paper} ${s.calendarPage} ${turn?s.turning:""}`} data-direction={direction} aria-label="Monthly calendar">
            <div className={s.paperHeading}><p className={s.smallCaps}>PLANS, POSSIBILITIES & EVERYDAY LIFE</p><div className={s.monthHeading}><button type="button" aria-label="Previous month" onClick={()=>pageTurn(-1)}>‹</button><h2 aria-live="polite">{monthTitle}</h2><button type="button" aria-label="Next month" onClick={()=>pageTurn(1)}>›</button></div><div className={s.rule}/></div>
            <div className={s.calendarTools}><span>Write a little plan in any square.</span><button type="button" onClick={()=>{const now=new Date();setMonth([now.getFullYear(),now.getMonth()]);chooseDay(dateKey(now));}}>Current month</button></div>
            <div className={s.calendar}><div className={s.weekdays}>{["SUN","MON","TUE","WED","THU","FRI","SAT"].map(d=><span key={d}>{d}</span>)}</div><div className={s.dateGrid} style={{"--weeks":cells.length/7}}>{cells.map((key,i)=>key?<div key={key} className={`${s.dateCell} ${key===day?s.selected:""} ${key===today?s.today:""}`}><button type="button" aria-label={`Open daily record for ${pretty(key)}`} aria-pressed={key===day} onClick={()=>chooseDay(key)}>{Number(key.slice(-2))}{key===today&&<span className={s.todayDot} aria-label="Today"/>}</button><textarea aria-label={`Calendar note for ${pretty(key)}`} value={records[key]?.event||""} onFocus={()=>chooseDay(key)} onChange={e=>update(key,{event:e.target.value})}/></div>:<div key={`blank-${i}`} className={`${s.dateCell} ${s.blank}`} aria-hidden="true"/>)}</div></div>
            <p className={s.calendarCaption}>Field trips. Lessons. Beautiful ordinary days.</p><div className={s.pageFoot}><button type="button" onClick={()=>pageTurn(-1)}>← Previous month</button><span aria-hidden="true">❧</span><button type="button" onClick={()=>pageTurn(1)}>Next month →</button></div>
          </section>
        </div><div className={s.ribbon} aria-hidden="true"/>
      </div>}
      <p className={s.archiveStatus}>Sample workspace <span>Permanent family archive: account setup pending</span></p>
    </section>
    <dialog className={s.printDialog} ref={printDialog} onCancel={()=>setPrintOpen(false)} aria-labelledby="print-title"><div className={s.printControls}><div><p className={s.eyebrow}>KEEP A COPY</p><button type="button" className={s.closePrint} aria-label="Close print records" onClick={()=>setPrintOpen(false)}>×</button><h2 id="print-title">Your records, on paper.</h2><p>A child’s report includes family notes and that child’s notes.</p></div><form onSubmit={e=>{e.preventDefault();setReport({scope,start,end});}}><label>Record for<select value={scope} onChange={e=>setScope(e.target.value)}><option value="family">Whole family</option>{children.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>From<input type="date" required max={end||undefined} value={start} onChange={e=>setStart(e.target.value)}/></label><label>Through<input type="date" required min={start||undefined} value={end} onChange={e=>setEnd(e.target.value)}/></label><button className={s.primary} type="submit">Preview record</button></form></div>
      {report&&<section className={s.report} aria-label="Printable record preview"><div className={s.reportActions}><p>Sample record preview</p><button type="button" className={s.primary} onClick={()=>window.print()}>Print this record</button></div><div className={s.reportHeader}><p>TEACH · FAMILY LEARNING RECORD</p><h2>{report.scope==="family"?"Family record":`${reportChildren[0]?.name}’s record`}</h2><p>{pretty(report.start,{month:"long",day:"numeric",year:"numeric"})} – {pretty(report.end,{month:"long",day:"numeric",year:"numeric"})}</p><small>Design preview · fictional sample records</small></div><div className={s.totals}>{reportChildren.map(c=><p key={c.id}><strong>{c.name}</strong> · {reportRows.filter(r=>r.children.find(x=>x.id===c.id)?.present).length} days marked schooled</p>)}</div>{reportRows.length?reportRows.map(r=><article className={s.reportDay} key={r.day}><h3>{pretty(r.day)}</h3>{r.event&&<p><strong>Calendar:</strong> {r.event}</p>}{r.familyNote&&<p><strong>Family notes:</strong> {r.familyNote}</p>}{r.children.map(c=><div key={c.id}><p><strong>{c.name}:</strong> {c.present?"Schooled":"Attendance not marked"}</p>{c.note&&<p><strong>{c.name}’s notes:</strong> {c.note}</p>}</div>)}</article>):<p>No recorded entries in this period.</p>}<p className={s.reportEnd}>Only recorded days are included. An unchecked box does not establish an absence.</p></section>}
    </dialog>
  </main>;
}
