export function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
export function monthCells(year, month) {
  const offset=new Date(year,month,1).getDay(),count=new Date(year,month+1,0).getDate();
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,i)=>i>=offset&&i<offset+count?dateKey(new Date(year,month,i-offset+1)):null);
}
export function makeReport(records,children,scope,start,end) {
  const selected=scope==="family"?children:children.filter(c=>c.id===scope);
  return Object.entries(records).filter(([day])=>day>=start&&day<=end).sort(([a],[b])=>a.localeCompare(b)).map(([day,r])=>({day,familyNote:r.familyNote||"",event:r.event||"",children:selected.map(c=>({...c,present:!!r.attendance?.[c.id],note:r.childNotes?.[c.id]||""}))})).filter(r=>r.familyNote||r.event||r.children.some(c=>c.present||c.note));
}

export function buildPrintReport(records,children,scope,start,end,content="attendance") {
  const selected=scope==="family"?children:children.filter(c=>c.id===scope);
  const rows=makeReport(records,children,scope,start,end);
  const hasAttendance=content!=="notes",hasNotes=content!=="attendance";
  return {
    children:selected,hasAttendance,hasNotes,
    attendanceRows:hasAttendance?rows.filter(r=>r.children.some(c=>c.present)).map(r=>({day:r.day,attendance:Object.fromEntries(r.children.map(c=>[c.id,c.present]))})):[],
    totals:hasAttendance?selected.map(c=>({id:c.id,name:c.name,days:rows.filter(r=>r.children.some(x=>x.id===c.id&&x.present)).length})):[],
    notesRows:hasNotes?rows.filter(r=>r.familyNote.trim()||r.event.trim()||r.children.some(c=>c.note.trim())).map(r=>({day:r.day,familyNote:r.familyNote,event:r.event,children:r.children.filter(c=>c.note.trim()).map(c=>({id:c.id,name:c.name,note:c.note}))})):[]
  };
}

export function attendanceMonths(rows,start,end){
  if(!start||!end||start>end)return [];
  const byDay=new Map(rows.map(row=>[row.day,row.attendance]));
  const [year,month]=start.split("-").map(Number),months=[];
  for(let cursor=new Date(year,month-1,1);dateKey(cursor).slice(0,7)<=end.slice(0,7);cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1)){
    const y=cursor.getFullYear(),m=cursor.getMonth(),count=new Date(y,m+1,0).getDate();
    months.push({month:dateKey(cursor),days:Array.from({length:31},(_,i)=>{
      const key=`${y}-${String(m+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
      return i<count&&key>=start&&key<=end?(byDay.get(key)||{}):null;
    })});
  }
  return months;
}
